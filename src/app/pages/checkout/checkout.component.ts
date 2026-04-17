import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { WhatsappService } from '../../core/services/whatsapp.service';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';

const FREE_DELIVERY_THRESHOLD = 999;
const DELIVERY_CHARGE = 99;

type PaymentMethod = 'whatsapp' | 'cod';

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
  paymentMethod: 'whatsapp',
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
  private readonly whatsappService = inject(WhatsappService);

  readonly items = this.cartService.items;
  readonly isEmpty = this.cartService.isEmpty;
  readonly subtotal = this.cartService.totalAmount;

  readonly hasFreeDelivery = computed(() => this.subtotal() >= FREE_DELIVERY_THRESHOLD);
  readonly total = computed(() => this.subtotal() + (this.hasFreeDelivery() ? 0 : DELIVERY_CHARGE));
  readonly deliveryLabel = `₹${DELIVERY_CHARGE}`;

  readonly submitting = signal(false);
  readonly orderPlaced = signal(false);

  form: CheckoutForm = { ...EMPTY_FORM };

  async placeOrder(): Promise<void> {
    const { name, phone, address, city, pincode } = this.form;
    if (!name || !phone || !address || !city || !pincode) return;

    this.submitting.set(true);

    try {
      const items = this.cartService.items();
      const total = this.total();

      await this.orderService.createOrder({
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
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (this.form.paymentMethod === 'whatsapp') {
        const fullAddress = `${this.form.address}, ${this.form.city} - ${this.form.pincode}`;
        this.whatsappService.sendOrder(items, this.form.name, fullAddress, total);
      }

      this.cartService.clearCart();
      this.orderPlaced.set(true);
    } catch (error) {
      console.error('Order placement failed:', error);
    } finally {
      this.submitting.set(false);
    }
  }
}
