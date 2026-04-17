import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { WhatsappService } from '../../core/services/whatsapp.service';
import { Product } from '../../core/models/product.model';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyInrPipe, SkeletonLoaderComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <a routerLink="/" class="hover:text-gold transition-colors">Home</a>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <a routerLink="/shop" class="hover:text-gold transition-colors">Shop</a>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <span class="text-gray-800 font-medium truncate">{{ product()?.name }}</span>
      </nav>

      @if (loading()) {
        <app-skeleton-loader type="product-detail" />
      } @else if (product()) {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <!-- Images -->
          <div class="space-y-4">
            <div class="aspect-square rounded-2xl overflow-hidden bg-white shadow-sm">
              <img
                [src]="selectedImage()"
                [alt]="product()!.name"
                class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            @if (product()!.images.length > 1) {
              <div class="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                @for (img of product()!.images; track img) {
                  <button
                    (click)="selectedImage.set(img)"
                    class="w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 shrink-0"
                    [class]="selectedImage() === img ? 'border-gold shadow-md' : 'border-gray-200 hover:border-gray-300'"
                  >
                    <img [src]="img" [alt]="product()!.name" class="w-full h-full object-cover" />
                  </button>
                }
              </div>
            }
          </div>

          <!-- Details -->
          <div class="space-y-6">
            <!-- Badges -->
            <div class="flex items-center gap-2 flex-wrap">
              @if (product()!.categoryName) {
                <span class="px-3 py-1 text-xs font-semibold text-gold bg-gold/10 rounded-full uppercase tracking-wider">
                  {{ product()!.categoryName }}
                </span>
              }
              @if (product()!.newArrival) {
                <span class="px-3 py-1 text-xs font-semibold text-white bg-maroon rounded-full">New Arrival</span>
              }
              @if (product()!.bestSeller) {
                <span class="px-3 py-1 text-xs font-semibold text-white bg-gold rounded-full">Bestseller</span>
              }
              @if (!product()!.inStock) {
                <span class="px-3 py-1 text-xs font-semibold text-white bg-gray-500 rounded-full">Out of Stock</span>
              }
            </div>

            <h1 class="font-heading text-2xl lg:text-4xl font-bold text-gray-900">
              {{ product()!.name }}
            </h1>

            <!-- Price -->
            <div class="flex items-baseline gap-3">
              <span class="text-3xl font-bold text-maroon">{{ product()!.price | inr }}</span>
              @if (product()!.originalPrice && product()!.originalPrice! > product()!.price) {
                <span class="text-lg text-gray-400 line-through">{{ product()!.originalPrice | inr }}</span>
                <span class="px-2.5 py-1 text-xs font-bold text-green-700 bg-green-100 rounded-full">
                  {{ getDiscount(product()!) }}% OFF
                </span>
              }
            </div>

            <!-- Description -->
            <p class="text-gray-600 leading-relaxed">{{ product()!.description }}</p>

            <!-- Specs -->
            @if (product()!.weight || product()!.material || product()!.dimensions) {
              <div class="bg-cream rounded-xl p-4 space-y-2">
                @if (product()!.material) {
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Material</span>
                    <span class="font-medium text-gray-800">{{ product()!.material }}</span>
                  </div>
                }
                @if (product()!.weight) {
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Weight</span>
                    <span class="font-medium text-gray-800">{{ product()!.weight }}</span>
                  </div>
                }
                @if (product()!.dimensions) {
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Dimensions</span>
                    <span class="font-medium text-gray-800">{{ product()!.dimensions }}</span>
                  </div>
                }
              </div>
            }

            <!-- Quantity -->
            @if (product()!.inStock) {
              <div class="flex items-center gap-4">
                <span class="text-sm font-medium text-gray-700">Quantity:</span>
                <div class="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    (click)="quantity() > 1 && quantity.set(quantity() - 1)"
                    class="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                  >-</button>
                  <span class="w-12 h-10 flex items-center justify-center text-sm font-semibold border-x border-gray-200">
                    {{ quantity() }}
                  </span>
                  <button
                    (click)="quantity.set(quantity() + 1)"
                    class="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                  >+</button>
                </div>
              </div>
            }

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row gap-3 pt-2">
              @if (product()!.inStock) {
                <button
                  (click)="addToCart(product()!)"
                  class="flex-1 px-6 py-4 bg-gradient-to-r from-maroon to-maroon-dark text-white font-semibold
                         rounded-full shadow-lg shadow-maroon/25 hover:shadow-xl
                         hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
                >
                  {{ addedToCart() ? 'Added to Cart!' : 'Add to Cart' }}
                </button>
              }
              <button
                (click)="inquireWhatsApp(product()!)"
                class="flex-1 px-6 py-4 bg-green-500 text-white font-semibold rounded-full shadow-lg
                       shadow-green-500/25 hover:bg-green-600 hover:-translate-y-0.5
                       transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Ask on WhatsApp
              </button>
            </div>

            <!-- Trust badges -->
            <div class="grid grid-cols-3 gap-3 pt-4">
              <div class="text-center p-3 bg-cream rounded-xl">
                <p class="text-xs font-semibold text-maroon">Free Delivery</p>
                <p class="text-[10px] text-gray-500">Above ₹999</p>
              </div>
              <div class="text-center p-3 bg-cream rounded-xl">
                <p class="text-xs font-semibold text-maroon">Easy Returns</p>
                <p class="text-[10px] text-gray-500">7 Day Policy</p>
              </div>
              <div class="text-center p-3 bg-cream rounded-xl">
                <p class="text-xs font-semibold text-maroon">COD Available</p>
                <p class="text-[10px] text-gray-500">Cash on Delivery</p>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div class="text-center py-20">
          <h2 class="font-heading text-2xl font-bold text-gray-700 mb-2">Product Not Found</h2>
          <p class="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
          <a routerLink="/shop" class="px-6 py-3 bg-maroon text-white rounded-full text-sm font-semibold">
            Back to Shop
          </a>
        </div>
      }
    </div>
  `,
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private whatsappService = inject(WhatsappService);

  product = signal<Product | null>(null);
  selectedImage = signal('');
  quantity = signal(1);
  loading = signal(true);
  addedToCart = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(id).subscribe((product) => {
        if (product) {
          this.product.set(product);
          this.selectedImage.set(product.images[0]);
        }
        this.loading.set(false);
      });
    }
  }

  getDiscount(product: Product): number {
    if (!product.originalPrice) return 0;
    return Math.round((1 - product.price / product.originalPrice) * 100);
  }

  addToCart(product: Product): void {
    this.cartService.addItem(
      {
        productId: product.id,
        name: product.name,
        image: product.images[0],
        price: product.price,
      },
      this.quantity()
    );
    this.addedToCart.set(true);
    setTimeout(() => this.addedToCart.set(false), 2000);
  }

  inquireWhatsApp(product: Product): void {
    this.whatsappService.sendInquiry(product.name, product.price);
  }
}
