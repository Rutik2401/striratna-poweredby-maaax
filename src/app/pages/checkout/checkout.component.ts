import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { PaymentService } from '../../core/services/payment.service';
import { SettingsService } from '../../core/services/settings.service';
import { WhatsappService } from '../../core/services/whatsapp.service';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';
import { ToastService } from '../../shared/services/toast.service';
import { PaymentProvider } from '../../core/models/order.model';

type PaymentMethod = PaymentProvider;
type FieldName = 'name' | 'phone' | 'email' | 'address' | 'city' | 'pincode';

interface CheckoutForm {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  paymentMethod: PaymentMethod;
  notes: string;
}

type FieldErrors = Partial<Record<FieldName, string>>;
type TouchedMap = Partial<Record<FieldName, boolean>>;

const EMPTY_FORM: CheckoutForm = {
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  pincode: '',
  paymentMethod: 'cashfree',
  notes: '',
};

const FIELD_INPUT_IDS: Record<FieldName, string> = {
  name: 'co-name',
  phone: 'co-phone',
  email: 'co-email',
  address: 'co-address',
  city: 'co-city',
  pincode: 'co-pincode',
};

const FIELD_LABELS: Record<FieldName, string> = {
  name: 'Full name',
  phone: 'Phone number',
  email: 'Email',
  address: 'Shipping address',
  city: 'City',
  pincode: 'Pincode',
};

@Component({
  selector: 'app-checkout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterLink, CurrencyInrPipe],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent {
  private readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);
  private readonly paymentService = inject(PaymentService);
  private readonly whatsappService = inject(WhatsappService);
  private readonly settings = inject(SettingsService);
  private readonly toast = inject(ToastService);

  readonly items = this.cartService.items;
  readonly isEmpty = this.cartService.isEmpty;
  readonly subtotal = this.cartService.totalAmount;

  readonly freeDeliveryThreshold = this.settings.freeDeliveryThreshold;
  readonly deliveryCharge = this.settings.deliveryCharge;

  readonly hasFreeDelivery = computed(
    () => this.subtotal() >= this.freeDeliveryThreshold()
  );
  readonly total = computed(
    () => this.subtotal() + (this.hasFreeDelivery() ? 0 : this.deliveryCharge())
  );
  readonly deliveryLabel = computed(() => `₹${this.deliveryCharge()}`);

  readonly submitting = signal(false);
  readonly orderPlaced = signal(false);
  readonly paymentPending = signal(false);
  readonly successMode = signal<'paid' | 'cod' | 'whatsapp' | 'pending'>('cod');

  readonly touched = signal<TouchedMap>({});
  readonly attemptedSubmit = signal(false);

  form: CheckoutForm = { ...EMPTY_FORM };

  private readonly formSignal = signal<CheckoutForm>({ ...EMPTY_FORM });

  readonly errors = computed<FieldErrors>(() => {
    const f = this.formSignal();
    const result: FieldErrors = {};

    const name = f.name.trim();
    if (!name) result.name = 'Please enter your full name';
    else if (name.length < 2) result.name = 'Name looks too short';
    else if (name.length > 60) result.name = 'Keep the name under 60 characters';

    const phoneDigits = f.phone.replace(/\D/g, '');
    if (!f.phone.trim()) result.phone = 'Phone number is required';
    else if (phoneDigits.length !== 10) result.phone = 'Enter a 10-digit mobile number';
    else if (!/^[6-9]/.test(phoneDigits))
      result.phone = 'Indian mobiles start with 6, 7, 8 or 9';

    const email = f.email.trim();
    if (email) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
      if (!emailOk) result.email = 'Enter a valid email or leave it blank';
    }

    const address = f.address.trim();
    if (!address) result.address = 'Please enter your shipping address';
    else if (address.length < 10) result.address = 'Please add enough detail — flat, building, street';

    const city = f.city.trim();
    if (!city) result.city = 'City is required';
    else if (city.length < 2) result.city = 'City looks too short';

    const pincodeDigits = f.pincode.replace(/\D/g, '');
    if (!f.pincode.trim()) result.pincode = 'Pincode is required';
    else if (pincodeDigits.length !== 6) result.pincode = 'Enter a 6-digit Indian pincode';
    else if (pincodeDigits.startsWith('0')) result.pincode = 'Pincode cannot start with 0';

    return result;
  });

  readonly isValid = computed(() => Object.keys(this.errors()).length === 0);

  readonly firstErrorField = computed<FieldName | null>(() => {
    const order: FieldName[] = ['name', 'phone', 'email', 'address', 'city', 'pincode'];
    const errs = this.errors();
    for (const key of order) {
      if (errs[key]) return key;
    }
    return null;
  });

  // Only errors the user should see right now (touched or after first submit attempt)
  readonly displayedErrors = computed<FieldErrors>(() => {
    const errs = this.errors();
    const touchedMap = this.touched();
    const showAll = this.attemptedSubmit();
    const result: FieldErrors = {};
    for (const key of Object.keys(errs) as FieldName[]) {
      if (showAll || touchedMap[key]) result[key] = errs[key];
    }
    return result;
  });

  setPaymentMethod(method: PaymentMethod): void {
    this.form.paymentMethod = method;
    this.syncForm();
  }

  onFieldInput(): void {
    this.syncForm();
  }

  onFieldBlur(field: FieldName): void {
    this.touched.update((t) => ({ ...t, [field]: true }));
    this.syncForm();
  }

  async placeOrder(): Promise<void> {
    if (this.submitting()) return;

    this.syncForm();
    this.attemptedSubmit.set(true);

    if (!this.isValid()) {
      const field = this.firstErrorField();
      const message = field ? this.errors()[field]! : 'Please fix the highlighted fields';
      this.toast.error('Form needs a fix', message);
      if (field) this.focusField(field);
      return;
    }

    this.submitting.set(true);

    try {
      const items = this.cartService.items();
      const total = this.total();

      const orderId = await this.orderService.createOrder({
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.name,
          productImage: i.image,
          price: i.price,
          quantity: i.quantity,
        })),
        totalAmount: total,
        customerName: this.form.name.trim(),
        customerPhone: this.form.phone.replace(/\D/g, ''),
        customerEmail: this.form.email.trim() || undefined,
        shippingAddress: this.form.address.trim(),
        city: this.form.city.trim(),
        pincode: this.form.pincode.replace(/\D/g, ''),
        status: 'pending',
        paymentMethod: this.form.paymentMethod,
        notes: this.form.notes.trim() || undefined,
      });

      if (this.form.paymentMethod === 'cashfree') {
        this.paymentPending.set(true);
        this.toast.info('Opening secure payment…', 'Do not close this tab.', 2500);

        const result = await this.paymentService.payOnline({
          orderId,
          amount: total,
          customer: {
            name: this.form.name.trim(),
            phone: this.form.phone.replace(/\D/g, ''),
            email: this.form.email.trim() || undefined,
          },
        });
        this.paymentPending.set(false);

        if (result.status === 'paid') {
          this.cartService.clearCart();
          this.successMode.set('paid');
          this.orderPlaced.set(true);
          this.toast.success(
            'Payment successful!',
            'Your order is confirmed and being prepared.'
          );
        } else if (result.status === 'pending') {
          this.successMode.set('pending');
          this.orderPlaced.set(true);
          this.toast.warning(
            'Confirming payment…',
            'We\'ll email you once the bank confirms — usually within a minute.'
          );
        } else {
          this.toast.error(
            'Payment not completed',
            result.error ?? 'Please try again or choose a different method.'
          );
        }
        return;
      }

      if (this.form.paymentMethod === 'whatsapp') {
        const fullAddress = `${this.form.address.trim()}, ${this.form.city.trim()} - ${this.form.pincode.replace(/\D/g, '')}`;
        this.whatsappService.sendOrder(items, this.form.name.trim(), fullAddress, total);
        this.cartService.clearCart();
        this.successMode.set('whatsapp');
        this.orderPlaced.set(true);
        this.toast.success('Order sent to WhatsApp', 'Hit send in WhatsApp to finish.');
        return;
      }

      // COD
      this.cartService.clearCart();
      this.successMode.set('cod');
      this.orderPlaced.set(true);
      this.toast.success(
        'Order placed!',
        'Your COD order is confirmed. We\'ll call to verify shortly.'
      );
    } catch (error) {
      console.error('Order placement failed:', error);
      this.paymentPending.set(false);
      this.toast.error(
        'Could not place your order',
        error instanceof Error ? error.message : 'Please check your connection and try again.'
      );
    } finally {
      this.submitting.set(false);
    }
  }

  private syncForm(): void {
    this.formSignal.set({ ...this.form });
  }

  private focusField(field: FieldName): void {
    setTimeout(() => {
      const el = document.getElementById(FIELD_INPUT_IDS[field]);
      if (el instanceof HTMLElement) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  }
}
