import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { PaymentService } from '../../core/services/payment.service';
import { WhatsappService } from '../../core/services/whatsapp.service';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';
import { PaymentProvider } from '../../core/models/order.model';

const FREE_DELIVERY_THRESHOLD = 999;
const DELIVERY_CHARGE = 99;

type PaymentMethod = PaymentProvider;

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

  readonly items = this.cartService.items;
  readonly isEmpty = this.cartService.isEmpty;
  readonly subtotal = this.cartService.totalAmount;

  readonly hasFreeDelivery = computed(() => this.subtotal() >= FREE_DELIVERY_THRESHOLD);
  readonly total = computed(() => this.subtotal() + (this.hasFreeDelivery() ? 0 : DELIVERY_CHARGE));
  readonly deliveryLabel = `₹${DELIVERY_CHARGE}`;

  readonly submitting = signal(false);
  readonly orderPlaced = signal(false);
  readonly paymentPending = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMode = signal<'paid' | 'cod' | 'whatsapp' | 'pending'>('cod');

  form: CheckoutForm = { ...EMPTY_FORM };

  setPaymentMethod(method: PaymentMethod): void {
    this.form.paymentMethod = method;
  }

  private firstMissingField(): string | null {
    if (!this.form.name.trim()) return 'your full name';
    if (!this.form.phone.trim()) return 'your phone number';
    if (!this.form.address.trim()) return 'your shipping address';
    if (!this.form.city.trim()) return 'your city';
    if (!this.form.pincode.trim()) return 'your pincode';
    return null;
  }

  async placeOrder(): Promise<void> {
    if (this.submitting()) return;

    const missing = this.firstMissingField();
    if (missing) {
      this.errorMessage.set(`Please fill in ${missing} to continue.`);
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

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
        customerName: this.form.name,
        customerPhone: this.form.phone,
        customerEmail: this.form.email || undefined,
        shippingAddress: this.form.address,
        city: this.form.city,
        pincode: this.form.pincode,
        status: 'pending',
        paymentMethod: this.form.paymentMethod,
        notes: this.form.notes || undefined,
      });

      if (this.form.paymentMethod === 'cashfree') {
        this.paymentPending.set(true);
        const result = await this.paymentService.payOnline({
          orderId,
          amount: total,
          customer: {
            name: this.form.name,
            phone: this.form.phone,
            email: this.form.email || undefined,
          },
        });
        this.paymentPending.set(false);

        if (result.status === 'paid') {
          this.cartService.clearCart();
          this.successMode.set('paid');
          this.orderPlaced.set(true);
        } else if (result.status === 'pending') {
          this.successMode.set('pending');
          this.orderPlaced.set(true);
        } else {
          this.errorMessage.set(result.error ?? 'Payment failed. Please try again.');
        }
        return;
      }

      if (this.form.paymentMethod === 'whatsapp') {
        const fullAddress = `${this.form.address}, ${this.form.city} - ${this.form.pincode}`;
        this.whatsappService.sendOrder(items, this.form.name, fullAddress, total);
        this.cartService.clearCart();
        this.successMode.set('whatsapp');
        this.orderPlaced.set(true);
        return;
      }

      // COD
      this.cartService.clearCart();
      this.successMode.set('cod');
      this.orderPlaced.set(true);
    } catch (error) {
      console.error('Order placement failed:', error);
      this.errorMessage.set(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      );
    } finally {
      this.submitting.set(false);
    }
  }
}
