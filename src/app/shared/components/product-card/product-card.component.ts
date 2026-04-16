import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { CurrencyInrPipe } from '../../pipes/currency-inr.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, CurrencyInrPipe],
  template: `
    <div class="bg-white rounded-xl overflow-hidden relative cursor-pointer border-2 border-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(128,0,32,0.12)] hover:border-gold"
         [class.opacity-75]="!product.inStock"
         (click)="goToProduct()">

      <!-- Discount Badge -->
      @if (discountPercent > 0) {
        <div class="absolute top-3 left-3 bg-maroon text-gold text-[0.8rem] font-bold py-1 px-2.5 rounded-full z-[2]">
          -{{ discountPercent }}%
        </div>
      }

      <!-- Out of Stock Overlay -->
      @if (!product.inStock) {
        <div class="absolute inset-0 bg-black/45 flex items-center justify-center z-[3] rounded-xl">
          <span class="bg-maroon/90 text-cream py-2 px-6 rounded font-['Playfair_Display',serif] text-lg font-semibold tracking-wide">Out of Stock</span>
        </div>
      }

      <!-- Image -->
      <div class="w-full aspect-square overflow-hidden bg-cream">
        @if (product.images && product.images.length > 0) {
          <img [src]="product.images[0]" [alt]="product.nameEn" class="w-full h-full object-cover transition-transform duration-400 hover:scale-105" />
        } @else {
          <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-cream to-[#f5e6c8]">
            <span class="material-icons text-[64px] text-gold opacity-40">diamond</span>
          </div>
        }
      </div>

      <!-- Details -->
      <div class="p-4 pb-5 px-5">
        <h3 class="font-['Playfair_Display',serif] text-base font-semibold text-gray-800 m-0 mb-2 leading-tight line-clamp-2">{{ product.nameEn }}</h3>

        <span class="inline-block bg-cream text-maroon text-xs font-semibold py-0.5 px-2.5 rounded-full border border-maroon/15 mb-3">{{ product.material }}</span>

        <div class="flex items-baseline gap-2 mb-3">
          @if (product.mrp > product.price) {
            <span class="text-sm text-gray-400 line-through">{{ product.mrp | currencyInr }}</span>
          }
          <span class="text-xl font-bold text-maroon">{{ product.price | currencyInr }}</span>
        </div>

        <button
          class="w-full py-2.5 px-4 border-none rounded-lg bg-gradient-to-br from-gold to-gold-dark text-white text-[0.9rem] font-semibold cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-200 hover:from-gold-dark hover:to-[#a6850a] hover:scale-[1.02] disabled:bg-gray-300 disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100"
          [disabled]="!product.inStock"
          (click)="addToCart($event)">
          <span class="material-icons text-[18px]">shopping_cart</span>
          {{ product.inStock ? 'Add to Cart' : 'Unavailable' }}
        </button>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`],
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  private router = inject(Router);
  private cartService = inject(CartService);

  get discountPercent(): number {
    if (!this.product || this.product.mrp <= this.product.price) return 0;
    return Math.round(((this.product.mrp - this.product.price) / this.product.mrp) * 100);
  }

  goToProduct(): void {
    if (this.product.id) {
      this.router.navigate(['/product', this.product.id]);
    }
  }

  addToCart(event: Event): void {
    event.stopPropagation();
    if (this.product.inStock) {
      this.cartService.addToCart(this.product);
    }
  }
}
