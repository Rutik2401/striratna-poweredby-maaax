import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { CurrencyInrPipe } from '../../pipes/currency-inr.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyInrPipe],
  template: `
    <div
      class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl
             transition-all duration-500 transform hover:-translate-y-1"
    >
      <!-- Image -->
      <a [routerLink]="['/product', product.id]" class="block relative overflow-hidden aspect-square">
        <img
          [src]="product.images[0]"
          [alt]="product.name"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          (load)="imageLoaded.set(true)"
          [class.opacity-0]="!imageLoaded()"
        />

        <!-- Skeleton while loading -->
        @if (!imageLoaded()) {
          <div class="absolute inset-0 bg-gray-200 animate-pulse"></div>
        }

        <!-- Badges -->
        <div class="absolute top-3 left-3 flex flex-col gap-1.5">
          @if (product.newArrival) {
            <span class="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-maroon text-white rounded-full">
              New
            </span>
          }
          @if (product.bestSeller) {
            <span class="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-gold text-white rounded-full">
              Bestseller
            </span>
          }
          @if (product.originalPrice && product.originalPrice > product.price) {
            <span class="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-green-600 text-white rounded-full">
              {{ getDiscount() }}% OFF
            </span>
          }
        </div>

        <!-- Quick Add Overlay -->
        @if (product.inStock) {
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300
                      flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
            <button
              (click)="addToCart($event)"
              class="px-6 py-2.5 bg-white text-maroon text-sm font-semibold rounded-full
                     shadow-lg transform translate-y-4 group-hover:translate-y-0
                     transition-all duration-300 hover:bg-gold hover:text-white active:scale-95"
            >
              {{ addedToCart() ? 'Added!' : 'Add to Cart' }}
            </button>
          </div>
        }

        @if (!product.inStock) {
          <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span class="px-4 py-2 bg-white/90 text-gray-800 text-sm font-semibold rounded-full">
              Out of Stock
            </span>
          </div>
        }
      </a>

      <!-- Info -->
      <div class="p-4">
        @if (product.categoryName) {
          <p class="text-[11px] text-gold font-semibold uppercase tracking-wider mb-1">
            {{ product.categoryName }}
          </p>
        }
        <a [routerLink]="['/product', product.id]">
          <h3 class="font-heading text-base font-semibold text-gray-900 line-clamp-2
                     group-hover:text-maroon transition-colors">
            {{ product.name }}
          </h3>
        </a>
        <div class="flex items-center gap-2 mt-2">
          <span class="text-lg font-bold text-maroon">{{ product.price | inr }}</span>
          @if (product.originalPrice && product.originalPrice > product.price) {
            <span class="text-sm text-gray-400 line-through">{{ product.originalPrice | inr }}</span>
          }
        </div>
      </div>
    </div>
  `,
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  private cartService = inject(CartService);
  imageLoaded = signal(false);
  addedToCart = signal(false);

  getDiscount(): number {
    if (!this.product.originalPrice) return 0;
    return Math.round((1 - this.product.price / this.product.originalPrice) * 100);
  }

  addToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addItem({
      productId: this.product.id,
      name: this.product.name,
      image: this.product.images[0],
      price: this.product.price,
    });
    this.addedToCart.set(true);
    setTimeout(() => this.addedToCart.set(false), 1500);
  }
}
