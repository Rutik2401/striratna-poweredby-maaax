import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyInrPipe],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 class="font-heading text-2xl lg:text-4xl font-bold text-maroon mb-8">Shopping Cart</h1>

      @if (cartService.isEmpty()) {
        <div class="text-center py-20">
          <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-cream flex items-center justify-center">
            <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 class="font-heading text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
          <p class="text-gray-500 mb-6">Start shopping to add items to your cart</p>
          <a routerLink="/shop"
             class="inline-flex items-center px-6 py-3 bg-maroon text-white rounded-full text-sm font-semibold
                    hover:bg-maroon-dark transition-colors">
            Continue Shopping
          </a>
        </div>
      } @else {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Cart Items -->
          <div class="lg:col-span-2 space-y-4">
            @for (item of cartService.items(); track item.productId) {
              <div class="bg-white rounded-2xl p-4 sm:p-6 shadow-sm flex gap-4 sm:gap-6
                          transition-all duration-300 hover:shadow-md">
                <!-- Image -->
                <a [routerLink]="['/product', item.productId]"
                   class="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <img [src]="item.image" [alt]="item.name"
                       class="w-full h-full object-cover" loading="lazy" />
                </a>

                <!-- Details -->
                <div class="flex-1 min-w-0">
                  <a [routerLink]="['/product', item.productId]"
                     class="font-heading text-base sm:text-lg font-semibold text-gray-900
                            hover:text-maroon transition-colors line-clamp-2">
                    {{ item.name }}
                  </a>
                  <p class="text-maroon font-bold mt-1">{{ item.price | inr }}</p>

                  <div class="flex items-center justify-between mt-3">
                    <!-- Quantity -->
                    <div class="flex items-center bg-cream border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        (click)="updateQuantity(item.productId, item.quantity - 1)"
                        class="w-8 h-8 flex items-center justify-center text-gray-600
                               hover:bg-gray-100 transition-colors text-sm">-</button>
                      <span class="w-10 h-8 flex items-center justify-center text-sm font-semibold
                                   border-x border-gray-200">
                        {{ item.quantity }}
                      </span>
                      <button
                        (click)="updateQuantity(item.productId, item.quantity + 1)"
                        class="w-8 h-8 flex items-center justify-center text-gray-600
                               hover:bg-gray-100 transition-colors text-sm">+</button>
                    </div>

                    <!-- Remove -->
                    <button
                      (click)="removeItem(item.productId)"
                      class="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            }

            <!-- Clear Cart -->
            <div class="text-right">
              <button
                (click)="clearCart()"
                class="text-sm text-gray-500 hover:text-red-500 transition-colors underline"
              >
                Clear all items
              </button>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 class="font-heading text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

              <div class="space-y-3 mb-6">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Subtotal ({{ cartService.itemCount() }} items)</span>
                  <span class="font-medium">{{ cartService.totalAmount() | inr }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Delivery</span>
                  <span class="font-medium text-green-600">
                    {{ cartService.totalAmount() >= 999 ? 'FREE' : '₹99' }}
                  </span>
                </div>
                <hr class="border-gray-100" />
                <div class="flex justify-between text-base font-bold">
                  <span class="text-gray-900">Total</span>
                  <span class="text-maroon">
                    {{ (cartService.totalAmount() >= 999 ? cartService.totalAmount() : cartService.totalAmount() + 99) | inr }}
                  </span>
                </div>
              </div>

              @if (cartService.totalAmount() < 999) {
                <p class="text-xs text-gold bg-gold/10 rounded-lg p-3 mb-4 text-center">
                  Add {{ (999 - cartService.totalAmount()) | inr }} more for FREE delivery!
                </p>
              }

              <a routerLink="/checkout"
                 class="block w-full text-center px-6 py-4 bg-gradient-to-r from-maroon to-maroon-dark
                        text-white font-semibold rounded-full shadow-lg shadow-maroon/25
                        hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 active:scale-95">
                Proceed to Checkout
              </a>

              <a routerLink="/shop"
                 class="block w-full text-center px-6 py-3 text-sm font-medium text-gray-600
                        hover:text-maroon transition-colors mt-3">
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class CartComponent {
  cartService = inject(CartService);

  updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: string): void {
    this.cartService.removeItem(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}
