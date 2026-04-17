import { Component, inject, OnInit, signal, computed, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, SkeletonLoaderComponent],
  template: `
    <!-- Hero Banner -->
    <section class="bg-gradient-to-r from-maroon to-maroon-dark text-white py-12 lg:py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="font-heading text-3xl lg:text-5xl font-bold mb-3">Our Collection</h1>
        <p class="text-white/70 text-sm lg:text-base">
          Discover premium 1gm art jewellery crafted with love
        </p>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <!-- Filters Bar -->
      <div class="flex flex-col sm:flex-row gap-4 mb-8">
        <!-- Search -->
        <div class="relative flex-1">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search jewellery..."
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearch($event)"
            class="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm
                   focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
          />
        </div>

        <!-- Category Filter -->
        <select
          [(ngModel)]="selectedCategory"
          (ngModelChange)="onCategoryChange($event)"
          class="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm
                 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold appearance-none
                 cursor-pointer min-w-[160px]"
        >
          <option value="">All Categories</option>
          @for (cat of categories(); track cat.id) {
            <option [value]="cat.id">{{ cat.name }}</option>
          }
        </select>

        <!-- Sort -->
        <select
          [(ngModel)]="sortBy"
          (ngModelChange)="applyFilters()"
          class="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm
                 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold appearance-none
                 cursor-pointer min-w-[160px]"
        >
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <!-- Active Filters -->
      @if (selectedCategory || searchQuery) {
        <div class="flex items-center gap-2 mb-6 flex-wrap">
          <span class="text-sm text-gray-500">Filters:</span>
          @if (selectedCategory) {
            <button
              (click)="selectedCategory = ''; onCategoryChange('')"
              class="inline-flex items-center gap-1 px-3 py-1.5 bg-gold/10 text-gold text-xs font-medium rounded-full
                     hover:bg-gold/20 transition-colors"
            >
              {{ getCategoryName(selectedCategory) }}
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          }
          @if (searchQuery) {
            <button
              (click)="searchQuery = ''; onSearch('')"
              class="inline-flex items-center gap-1 px-3 py-1.5 bg-maroon/10 text-maroon text-xs font-medium rounded-full
                     hover:bg-maroon/20 transition-colors"
            >
              "{{ searchQuery }}"
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          }
        </div>
      }

      <!-- Results Count -->
      <p class="text-sm text-gray-500 mb-6">
        {{ filteredProducts().length }} {{ filteredProducts().length === 1 ? 'product' : 'products' }} found
      </p>

      <!-- Products Grid -->
      @if (loading()) {
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          @for (_ of [1,2,3,4,5,6,7,8]; track $index) {
            <app-skeleton-loader type="product-card" />
          }
        </div>
      } @else if (filteredProducts().length === 0) {
        <div class="text-center py-20">
          <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 class="font-heading text-xl font-semibold text-gray-700 mb-2">No products found</h3>
          <p class="text-sm text-gray-500">Try adjusting your search or filters</p>
        </div>
      } @else {
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          @for (product of filteredProducts(); track product.id) {
            <app-product-card [product]="product" />
          }
        </div>
      }
    </div>
  `,
})
export class ShopComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  allProducts = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(true);

  searchQuery = '';
  selectedCategory = '';
  sortBy = 'newest';

  filteredProducts = computed(() => {
    let products = [...this.allProducts()];

    if (this.selectedCategory) {
      products = products.filter((p) => p.categoryId === this.selectedCategory);
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }

    switch (this.sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        break;
    }

    return products;
  });

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        if (params['category']) {
          this.selectedCategory = params['category'];
        }
      });

    this.productService.getProducts().subscribe((products) => {
      this.allProducts.set(products);
      this.loading.set(false);
    });

    this.categoryService.getActiveCategories().subscribe((cats) => {
      this.categories.set(cats);
    });
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.applyFilters();
  }

  onCategoryChange(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.applyFilters();
  }

  applyFilters(): void {
    // Trigger computed re-evaluation by updating signal
    this.allProducts.update((p) => [...p]);
  }

  getCategoryName(id: string): string {
    return this.categories().find((c) => c.id === id)?.name || 'Category';
  }
}
