import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent, SkeletonLoaderComponent, CurrencyInrPipe],
  template: `
    <!-- Hero Section -->
    <section class="relative min-h-[90vh] flex items-center bg-gradient-to-br from-cream via-white to-cream overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute top-20 right-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-10 left-10 w-96 h-96 bg-maroon/5 rounded-full blur-3xl"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Left Content -->
          <div class="text-center lg:text-left space-y-6"
               style="animation: fadeInUp 0.8s ease-out">
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full">
              <span class="w-2 h-2 bg-gold rounded-full animate-pulse"></span>
              <span class="text-sm font-medium text-gold-dark">Premium Art Jewellery</span>
            </div>

            <h1 class="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-maroon leading-tight">
              स्त्रीरत्न
              <span class="block text-2xl sm:text-3xl lg:text-4xl text-gold mt-2">
                साज महाराष्ट्राचा
              </span>
            </h1>

            <p class="text-base sm:text-lg text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Premium 1gm Art Jewellery that looks luxurious, feels lightweight, and fits your budget.
              Handcrafted with love from Pune, Maharashtra.
            </p>

            <!-- Story highlight -->
            <div class="bg-white rounded-2xl p-5 shadow-sm border border-gold/10 max-w-lg mx-auto lg:mx-0"
                 style="animation: fadeInUp 1s ease-out">
              <p class="text-sm text-gray-500 italic">
                "1000+ messages daily... Our small team couldn't reply to everyone.
                So we built this platform - so you can browse, choose, and order without waiting."
              </p>
              <p class="text-xs text-gold font-semibold mt-2">- Team स्त्रीरत्न</p>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a routerLink="/shop"
                 class="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-maroon to-maroon-dark
                        text-white font-semibold rounded-full shadow-lg shadow-maroon/25
                        hover:shadow-xl hover:shadow-maroon/30 hover:-translate-y-0.5
                        transition-all duration-300 active:scale-95">
                Shop Now
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a routerLink="/about"
                 class="inline-flex items-center justify-center px-8 py-4 bg-white text-maroon
                        font-semibold rounded-full border-2 border-maroon/20
                        hover:border-gold hover:text-gold transition-all duration-300">
                Our Story
              </a>
            </div>
          </div>

          <!-- Right Visual -->
          <div class="relative hidden lg:flex items-center justify-center"
               style="animation: fadeInUp 1.2s ease-out">
            <div class="w-80 h-80 xl:w-96 xl:h-96 rounded-full bg-gradient-to-br from-gold/20 to-maroon/10
                        flex items-center justify-center relative">
              <div class="absolute inset-4 rounded-full border-2 border-dashed border-gold/30 animate-[spin_20s_linear_infinite]"></div>
              <div class="text-center">
                <span class="font-heading text-6xl text-maroon/80">स्त्री</span>
                <p class="text-sm text-gold font-medium mt-2">Since Pune</p>
              </div>
            </div>
            <!-- Floating badges -->
            <div class="absolute top-8 right-8 bg-white rounded-xl shadow-lg p-3 animate-float">
              <p class="text-xs font-semibold text-maroon">1gm Gold Look</p>
            </div>
            <div class="absolute bottom-12 left-4 bg-white rounded-xl shadow-lg p-3 animate-float"
                 style="animation-delay: 1s">
              <p class="text-xs font-semibold text-gold">Affordable Price</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust Strip -->
    <section class="bg-white py-6 border-y border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          @for (stat of trustStats; track stat.label) {
            <div class="space-y-1">
              <p class="text-2xl font-bold text-maroon">{{ stat.value }}</p>
              <p class="text-xs text-gray-500 font-medium">{{ stat.label }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Categories -->
    @if (categories().length > 0) {
      <section class="py-16 lg:py-20 bg-cream">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <p class="text-sm font-semibold text-gold uppercase tracking-wider mb-2">Collections</p>
            <h2 class="font-heading text-3xl lg:text-4xl font-bold text-maroon">
              Shop by Category
            </h2>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            @for (category of categories(); track category.id) {
              <a
                [routerLink]="['/shop']"
                [queryParams]="{ category: category.id }"
                class="group relative overflow-hidden rounded-2xl aspect-square bg-gradient-to-br from-maroon/80 to-maroon
                       flex items-end p-4 hover:shadow-xl transition-all duration-500"
              >
                @if (category.image) {
                  <img
                    [src]="category.image"
                    [alt]="category.name"
                    class="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                }
                <div class="relative z-10">
                  <h3 class="font-heading text-lg font-semibold text-white">{{ category.name }}</h3>
                  @if (category.nameMarathi) {
                    <p class="text-xs text-white/70">{{ category.nameMarathi }}</p>
                  }
                </div>
              </a>
            }
          </div>
        </div>
      </section>
    }

    <!-- Featured Products -->
    <section class="py-16 lg:py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between mb-12">
          <div>
            <p class="text-sm font-semibold text-gold uppercase tracking-wider mb-2">Curated for You</p>
            <h2 class="font-heading text-3xl lg:text-4xl font-bold text-maroon">
              Featured Collection
            </h2>
          </div>
          <a routerLink="/shop" class="hidden sm:inline-flex items-center text-sm font-semibold text-maroon
                                       hover:text-gold transition-colors">
            View All
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        @if (loading()) {
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            @for (_ of [1,2,3,4,5,6,7,8]; track $index) {
              <app-skeleton-loader type="product-card" />
            }
          </div>
        } @else {
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            @for (product of featuredProducts(); track product.id) {
              <app-product-card [product]="product" />
            }
          </div>
        }

        <div class="text-center mt-8 sm:hidden">
          <a routerLink="/shop"
             class="inline-flex items-center px-6 py-3 bg-maroon text-white rounded-full text-sm font-semibold
                    hover:bg-maroon-dark transition-colors">
            View All Products
          </a>
        </div>
      </div>
    </section>

    <!-- Best Sellers -->
    @if (bestSellers().length > 0) {
      <section class="py-16 lg:py-20 bg-cream">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <p class="text-sm font-semibold text-gold uppercase tracking-wider mb-2">Most Loved</p>
            <h2 class="font-heading text-3xl lg:text-4xl font-bold text-maroon">Best Sellers</h2>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            @for (product of bestSellers(); track product.id) {
              <app-product-card [product]="product" />
            }
          </div>
        </div>
      </section>
    }

    <!-- Story Section / CTA -->
    <section class="py-16 lg:py-24 bg-gradient-to-br from-maroon to-maroon-dark text-white relative overflow-hidden">
      <div class="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 class="font-heading text-3xl lg:text-5xl font-bold mb-6">
          From <span class="text-gold">1000+ DMs</span> to Your Doorstep
        </h2>
        <p class="text-lg text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
          We were overwhelmed with love from Instagram. Now you can browse our entire collection,
          choose what you love, and order directly - no waiting for replies.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a routerLink="/shop"
             class="inline-flex items-center justify-center px-8 py-4 bg-gold text-white
                    font-semibold rounded-full hover:bg-gold-light transition-all duration-300
                    shadow-lg shadow-gold/25 active:scale-95">
            Start Shopping
          </a>
          <a routerLink="/contact"
             class="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white
                    font-semibold rounded-full border border-white/20
                    hover:bg-white/20 transition-all duration-300">
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  featuredProducts = signal<Product[]>([]);
  bestSellers = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(true);

  trustStats = [
    { value: '10,000+', label: 'Happy Customers' },
    { value: '500+', label: 'Designs' },
    { value: '4.8★', label: 'Average Rating' },
    { value: 'Pune', label: 'Made in India' },
  ];

  ngOnInit(): void {
    this.productService.getFeaturedProducts().subscribe((products) => {
      this.featuredProducts.set(products);
      this.loading.set(false);
    });

    this.productService.getBestSellers().subscribe((products) => {
      this.bestSellers.set(products);
    });

    this.categoryService.getActiveCategories().subscribe((categories) => {
      this.categories.set(categories);
    });
  }
}
