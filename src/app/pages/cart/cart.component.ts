import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../core/services/cart.service';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CurrencyInrPipe,
  ],
  template: `
    <div class="max-w-[1100px] mx-auto p-4 md:p-6">
      <h1 class="text-center text-2xl md:text-3xl font-bold text-maroon mb-2">Shopping Cart</h1>
      <div class="w-[60px] h-[3px] bg-gold mx-auto mb-6"></div>

      <!-- Empty Cart -->
      <div *ngIf="cartService.items().length === 0" class="text-center py-16">
        <span class="material-icons text-7xl text-gray-300">shopping_cart</span>
        <h2 class="text-maroon text-xl font-bold mt-4 mb-2">Your cart is empty</h2>
        <p class="text-gray-500 mb-6">Looks like you haven't added any jewelry yet</p>
        <a
          routerLink="/shop"
          class="inline-block bg-gold text-maroon font-semibold px-8 py-3 rounded-full hover:bg-gold-light transition-colors"
        >
          Continue Shopping
        </a>
      </div>

      <!-- Cart Items -->
      <div *ngIf="cartService.items().length > 0" class="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-6 items-start">
        <div class="flex flex-col gap-4">
          <div
            class="flex gap-4 bg-cream p-4 rounded-xl relative"
            *ngFor="let item of cartService.items()"
          >
            <div class="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
              <img [src]="item.product.images[0]" [alt]="item.product.nameEn" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-maroon font-semibold text-base mb-1 truncate">{{ item.product.nameEn }}</h3>
              <p class="text-gold font-semibold mb-2">{{ item.product.price | currencyInr }}</p>
              <div class="flex items-center gap-3 mb-2">
                <button
                  class="w-8 h-8 rounded-full bg-gold text-maroon flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold-light transition-colors"
                  (click)="updateQty(item, -1)"
                  [disabled]="item.quantity <= 1"
                >
                  <span class="material-icons text-base">remove</span>
                </button>
                <span class="font-semibold text-lg">{{ item.quantity }}</span>
                <button
                  class="w-8 h-8 rounded-full bg-gold text-maroon flex items-center justify-center hover:bg-gold-light transition-colors"
                  (click)="updateQty(item, 1)"
                >
                  <span class="material-icons text-base">add</span>
                </button>
              </div>
              <p class="text-gray-700 text-sm font-medium">
                Total: {{ item.product.price * item.quantity | currencyInr }}
              </p>
            </div>
            <button
              class="absolute top-3 right-3 text-rose-gold hover:text-maroon transition-colors"
              (click)="removeItem(item.product.id!)"
            >
              <span class="material-icons">delete</span>
            </button>
          </div>
        </div>

        <!-- Price Summary -->
        <div class="bg-cream p-6 rounded-xl sticky top-4">
          <h2 class="text-maroon text-xl font-bold mb-4">Price Summary</h2>
          <div class="flex justify-between mb-3">
            <span>Subtotal</span>
            <span>{{ subtotal() | currencyInr }}</span>
          </div>
          <div class="flex justify-between mb-3">
            <span>Delivery</span>
            <span [class.text-green-500]="deliveryCharge() === 0" [class.font-semibold]="deliveryCharge() === 0">
              {{ deliveryCharge() === 0 ? 'FREE' : (deliveryCharge() | currencyInr) }}
            </span>
          </div>
          <p class="text-rose-gold text-sm mb-3" *ngIf="subtotal() < 999">
            Add {{ 999 - subtotal() | currencyInr }} more for FREE delivery
          </p>
          <div class="border-t-2 border-gold my-3"></div>
          <div class="flex justify-between text-xl font-bold text-maroon mb-6">
            <span>Total</span>
            <span>{{ total() | currencyInr }}</span>
          </div>
          <a
            routerLink="/checkout"
            class="block w-full text-center bg-gold text-maroon text-lg font-semibold py-3 rounded-full hover:bg-gold-light transition-colors"
          >
            Proceed to Checkout
          </a>
          <a
            routerLink="/shop"
            class="block w-full text-center mt-3 border-2 border-maroon text-maroon py-2.5 rounded-full font-medium hover:bg-maroon hover:text-cream transition-colors"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
})
export class CartComponent {
  cartService = inject(CartService);

  subtotal = this.cartService.total;

  deliveryCharge = computed(() => (this.subtotal() >= 999 ? 0 : 49));

  total = computed(() => this.subtotal() + this.deliveryCharge());

  updateQty(item: CartItem, delta: number): void {
    if (delta > 0) {
      this.cartService.addToCart(item.product);
    } else if (item.quantity > 1) {
      // Replace item with quantity - 1
      this.cartService.removeFromCart(item.product.id!);
      const newQty = item.quantity - 1;
      for (let i = 0; i < newQty; i++) {
        this.cartService.addToCart(item.product);
      }
    }
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
  }
}
