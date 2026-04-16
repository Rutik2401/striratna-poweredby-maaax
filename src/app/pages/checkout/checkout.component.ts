import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { WhatsAppService } from '../../core/services/whatsapp.service';
import { Order, OrderItem, CustomerDetails } from '../../core/models/order.model';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    CurrencyInrPipe,
  ],
  template: `
    <div class="max-w-[1100px] mx-auto p-4 md:p-6">
      <h1 class="text-center text-2xl md:text-3xl font-bold text-maroon mb-2">Checkout</h1>
      <div class="w-[60px] h-[3px] bg-gold mx-auto mb-6"></div>

      <!-- Order Success -->
      <div *ngIf="orderPlaced" class="text-center py-12">
        <span class="material-icons text-7xl text-green-500">check_circle</span>
        <h2 class="text-maroon text-xl font-bold mt-4 mb-2">Order Placed Successfully!</h2>
        <p class="text-lg mb-4">Order Number: <strong>{{ orderNumber }}</strong></p>
        <p class="text-gray-600 mb-6">Your order details have been sent via WhatsApp. We will confirm shortly.</p>
        <a
          routerLink="/shop"
          class="inline-block bg-gold text-maroon font-semibold px-8 py-3 rounded-full hover:bg-gold-light transition-colors"
        >
          Continue Shopping
        </a>
      </div>

      <!-- Empty Cart -->
      <div *ngIf="!orderPlaced && cartService.items().length === 0" class="text-center py-12">
        <span class="material-icons text-7xl text-gray-300">remove_shopping_cart</span>
        <h2 class="text-maroon text-xl font-bold mt-4 mb-2">Your cart is empty</h2>
        <p class="text-gray-500 mb-6">Add some products before checking out</p>
        <a
          routerLink="/shop"
          class="inline-block bg-gold text-maroon font-semibold px-8 py-3 rounded-full hover:bg-gold-light transition-colors"
        >
          Browse Products
        </a>
      </div>

      <!-- Checkout Form -->
      <div *ngIf="!orderPlaced && cartService.items().length > 0" class="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-6 items-start">
        <!-- Customer Form -->
        <div>
          <h2 class="text-maroon text-xl font-bold mb-5">Delivery Details</h2>
          <form [formGroup]="customerForm" class="space-y-4">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                formControlName="name"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
              />
              <p *ngIf="customerForm.get('name')?.touched && customerForm.get('name')?.hasError('required')" class="text-red-500 text-sm mt-1">Name is required</p>
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                formControlName="phone"
                type="tel"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
              />
              <p *ngIf="customerForm.get('phone')?.touched && customerForm.get('phone')?.hasError('required')" class="text-red-500 text-sm mt-1">Phone is required</p>
              <p *ngIf="customerForm.get('phone')?.touched && customerForm.get('phone')?.hasError('pattern')" class="text-red-500 text-sm mt-1">Enter a valid 10-digit number</p>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
              <input
                formControlName="email"
                type="email"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
              />
              <p *ngIf="customerForm.get('email')?.touched && customerForm.get('email')?.hasError('email')" class="text-red-500 text-sm mt-1">Enter a valid email</p>
            </div>

            <!-- Address -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
              <input
                formControlName="address"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
              />
              <p *ngIf="customerForm.get('address')?.touched && customerForm.get('address')?.hasError('required')" class="text-red-500 text-sm mt-1">Address is required</p>
            </div>

            <!-- Address 2 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
              <input
                formControlName="address2"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
              />
            </div>

            <!-- City & State -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  formControlName="city"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                />
                <p *ngIf="customerForm.get('city')?.touched && customerForm.get('city')?.hasError('required')" class="text-red-500 text-sm mt-1">City is required</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">State</label>
                <select
                  formControlName="state"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                >
                  <option value="">Select State</option>
                  <option *ngFor="let state of indianStates" [value]="state">{{ state }}</option>
                </select>
                <p *ngIf="customerForm.get('state')?.touched && customerForm.get('state')?.hasError('required')" class="text-red-500 text-sm mt-1">State is required</p>
              </div>
            </div>

            <!-- Pincode -->
            <div class="md:w-1/2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
              <input
                formControlName="pincode"
                maxlength="6"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
              />
              <p *ngIf="customerForm.get('pincode')?.touched && customerForm.get('pincode')?.hasError('required')" class="text-red-500 text-sm mt-1">Pincode is required</p>
              <p *ngIf="customerForm.get('pincode')?.touched && customerForm.get('pincode')?.hasError('pattern')" class="text-red-500 text-sm mt-1">Enter a valid 6-digit pincode</p>
            </div>
          </form>
        </div>

        <!-- Order Summary -->
        <div class="bg-cream p-6 rounded-xl sticky top-4">
          <h2 class="text-maroon text-xl font-bold mb-4">Order Summary</h2>
          <div class="flex flex-col gap-3 max-h-[300px] overflow-y-auto mb-4">
            <div class="flex gap-3 items-center" *ngFor="let item of cartService.items()">
              <img [src]="item.product.images[0]" [alt]="item.product.nameEn" class="w-12 h-12 rounded-md object-cover flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-800 truncate">{{ item.product.nameEn }}</p>
                <p class="text-xs text-gray-500">Qty: {{ item.quantity }}</p>
              </div>
              <p class="font-semibold text-maroon text-sm whitespace-nowrap">{{ item.product.price * item.quantity | currencyInr }}</p>
            </div>
          </div>

          <div class="border-t border-gold my-4"></div>

          <div class="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>{{ subtotal() | currencyInr }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span>Delivery</span>
            <span [class.text-green-500]="deliveryCharge() === 0" [class.font-semibold]="deliveryCharge() === 0">
              {{ deliveryCharge() === 0 ? 'FREE' : (deliveryCharge() | currencyInr) }}
            </span>
          </div>
          <div class="border-t border-gold my-4"></div>
          <div class="flex justify-between text-xl font-bold text-maroon mb-6">
            <span>Total</span>
            <span>{{ total() | currencyInr }}</span>
          </div>

          <button
            class="w-full flex items-center justify-center gap-2 bg-whatsapp text-white text-lg font-semibold py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            (click)="placeOrder()"
            [disabled]="submitting || customerForm.invalid"
          >
            <span class="material-icons">chat</span>
            {{ submitting ? 'Placing Order...' : 'Place Order via WhatsApp' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  cartService = inject(CartService);
  private orderService = inject(OrderService);
  private whatsAppService = inject(WhatsAppService);

  orderPlaced = false;
  orderNumber = '';
  submitting = false;

  subtotal = this.cartService.total;
  deliveryCharge = computed(() => (this.subtotal() >= 999 ? 0 : 49));
  total = computed(() => this.subtotal() + this.deliveryCharge());

  customerForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    email: ['', Validators.email],
    address: ['', Validators.required],
    address2: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  indianStates: string[] = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
    'Andaman & Nicobar Islands', 'Dadra & Nagar Haveli and Daman & Diu', 'Lakshadweep',
  ];

  placeOrder(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const formVal = this.customerForm.value;

    const customer: CustomerDetails = {
      name: formVal.name,
      phone: formVal.phone,
      email: formVal.email || undefined,
      address: formVal.address2
        ? `${formVal.address}, ${formVal.address2}`
        : formVal.address,
      city: formVal.city,
      state: formVal.state,
      pincode: formVal.pincode,
    };

    const items: OrderItem[] = this.cartService.items().map(ci => ({
      productId: ci.product.id!,
      productName: ci.product.nameEn,
      price: ci.product.price,
      quantity: ci.quantity,
      image: ci.product.images[0] || '',
    }));

    const order: Order = {
      orderNumber: this.generateOrderNumber(),
      customer,
      items,
      subtotal: this.subtotal(),
      deliveryCharge: this.deliveryCharge(),
      totalAmount: this.total(),
      status: 'pending',
      whatsappSent: false,
    };

    this.orderService.create(order).then(() => {
        const message = this.whatsAppService.buildOrderMessage(order);
        this.whatsAppService.sendViaWhatsApp(message);
        this.orderNumber = order.orderNumber;
        this.orderPlaced = true;
        this.submitting = false;
        this.cartService.clearCart();
      }).catch(() => {
        this.submitting = false;
        alert('Failed to place order. Please try again.');
      });
  }

  private generateOrderNumber(): string {
    const now = new Date();
    const datePart = now.toISOString().slice(2, 10).replace(/-/g, '');
    const randPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SR-${datePart}-${randPart}`;
  }
}
