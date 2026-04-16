import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

interface PriceRange {
  label: string;
  min: number;
  max: number;
  checked: boolean;
}

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ProductCardComponent,
  ],
  template: `
    <div class="max-w-[1200px] mx-auto p-4 md:p-6">
      <h1 class="text-center text-2xl md:text-3xl font-bold text-maroon mb-2">Our Collection</h1>
      <div class="w-[60px] h-[3px] bg-gold mx-auto mb-6"></div>

      <!-- Search & Sort -->
      <div class="flex flex-wrap gap-3 mb-6">
        <div class="flex-1 min-w-[200px] relative">
          <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input
            type="text"
            placeholder="Search jewelry..."
            [(ngModel)]="searchTerm"
            (ngModelChange)="applyFilters()"
            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
          />
        </div>
        <div class="min-w-[180px]">
          <select
            [(ngModel)]="sortBy"
            (ngModelChange)="applyFilters()"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
          >
            <option value="newest">Sort: Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
        <!-- Mobile filter toggle -->
        <button
          class="md:hidden flex items-center justify-center gap-2 w-full py-2.5 border-2 border-maroon text-maroon rounded-lg font-medium hover:bg-maroon hover:text-cream transition-colors"
          (click)="showFilters = !showFilters"
        >
          <span class="material-icons text-xl">filter_list</span>
          {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
        </button>

        <!-- Sidebar Filters -->
        <aside
          class="self-start sticky top-4"
          [class.hidden]="!showFilters"
          [class.md:block]="true"
        >
          <!-- Category Filter -->
          <div class="border border-gray-200 rounded-lg mb-2 overflow-hidden">
            <button
              class="w-full flex items-center justify-between px-4 py-3 bg-white font-semibold text-maroon"
              (click)="showCategoryFilter = !showCategoryFilter"
            >
              Category
              <span class="material-icons text-sm transition-transform" [class.rotate-180]="showCategoryFilter">expand_more</span>
            </button>
            <div *ngIf="showCategoryFilter" class="px-4 pb-3 flex flex-col gap-2">
              <label
                *ngFor="let cat of categories"
                class="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-maroon"
              >
                <input
                  type="checkbox"
                  [checked]="selectedCategories.has(cat.id!)"
                  (change)="toggleCategory(cat.id!)"
                  class="w-4 h-4 accent-maroon rounded"
                />
                {{ cat.nameEn }}
              </label>
            </div>
          </div>

          <!-- Price Range Filter -->
          <div class="border border-gray-200 rounded-lg mb-2 overflow-hidden">
            <button
              class="w-full flex items-center justify-between px-4 py-3 bg-white font-semibold text-maroon"
              (click)="showPriceFilter = !showPriceFilter"
            >
              Price Range
              <span class="material-icons text-sm transition-transform" [class.rotate-180]="showPriceFilter">expand_more</span>
            </button>
            <div *ngIf="showPriceFilter" class="px-4 pb-3 flex flex-col gap-2">
              <label
                *ngFor="let range of priceRanges"
                class="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-maroon"
              >
                <input
                  type="checkbox"
                  [(ngModel)]="range.checked"
                  (ngModelChange)="applyFilters()"
                  class="w-4 h-4 accent-maroon rounded"
                />
                {{ range.label }}
              </label>
            </div>
          </div>

          <!-- Material Filter -->
          <div class="border border-gray-200 rounded-lg mb-2 overflow-hidden">
            <button
              class="w-full flex items-center justify-between px-4 py-3 bg-white font-semibold text-maroon"
              (click)="showMaterialFilter = !showMaterialFilter"
            >
              Material
              <span class="material-icons text-sm transition-transform" [class.rotate-180]="showMaterialFilter">expand_more</span>
            </button>
            <div *ngIf="showMaterialFilter" class="px-4 pb-3 flex flex-col gap-2">
              <label
                *ngFor="let mat of materials"
                class="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-maroon"
              >
                <input
                  type="checkbox"
                  [checked]="selectedMaterials.has(mat)"
                  (change)="toggleMaterial(mat)"
                  class="w-4 h-4 accent-maroon rounded"
                />
                {{ mat }}
              </label>
            </div>
          </div>

          <button
            class="w-full mt-3 py-2 border border-rose-gold text-rose-gold rounded-lg text-sm font-medium hover:bg-rose-gold hover:text-white transition-colors"
            (click)="clearFilters()"
          >
            Clear All Filters
          </button>
        </aside>

        <!-- Products Grid -->
        <main>
          <!-- Loading -->
          <div *ngIf="loading" class="text-center py-16 text-gray-500">
            <div class="inline-block w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>Loading products...</p>
          </div>

          <!-- Empty State -->
          <div *ngIf="!loading && filteredProducts.length === 0" class="text-center py-16">
            <span class="material-icons text-6xl text-gray-300">search_off</span>
            <h3 class="text-maroon mt-4 mb-2 text-lg font-semibold">No products found</h3>
            <p class="text-gray-500 mb-4">Try adjusting your filters or search term</p>
            <button
              class="border border-maroon text-maroon px-6 py-2 rounded-lg font-medium hover:bg-maroon hover:text-cream transition-colors"
              (click)="clearFilters()"
            >
              Clear Filters
            </button>
          </div>

          <!-- Product Grid -->
          <div *ngIf="!loading && filteredProducts.length > 0" class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            <app-product-card
              *ngFor="let product of filteredProducts"
              [product]="product"
            ></app-product-card>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
})
export class ShopComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  loading = true;
  showFilters = false;
  showCategoryFilter = true;
  showPriceFilter = true;
  showMaterialFilter = true;

  searchTerm = '';
  sortBy = 'newest';
  selectedCategories = new Set<string>();
  selectedMaterials = new Set<string>();

  priceRanges: PriceRange[] = [
    { label: 'Under \u20B9500', min: 0, max: 500, checked: false },
    { label: '\u20B9500 - \u20B91,000', min: 500, max: 1000, checked: false },
    { label: '\u20B91,000 - \u20B92,000', min: 1000, max: 2000, checked: false },
    { label: 'Above \u20B92,000', min: 2000, max: Infinity, checked: false },
  ];

  materials = ['Gold Plated', 'Silver', 'Artificial', 'Oxidized'];

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(cats => {
      this.categories = cats.filter(c => c.isActive);
    });

    this.route.paramMap.subscribe(params => {
      const categoryId = params.get('category');
      if (categoryId) {
        this.selectedCategories.add(categoryId);
      }
    });

    this.productService.getAll().subscribe(products => {
      this.allProducts = products;
      this.loading = false;
      this.applyFilters();
    });
  }

  toggleCategory(id: string): void {
    if (this.selectedCategories.has(id)) {
      this.selectedCategories.delete(id);
    } else {
      this.selectedCategories.add(id);
    }
    this.applyFilters();
  }

  toggleMaterial(mat: string): void {
    if (this.selectedMaterials.has(mat)) {
      this.selectedMaterials.delete(mat);
    } else {
      this.selectedMaterials.add(mat);
    }
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.sortBy = 'newest';
    this.selectedCategories.clear();
    this.selectedMaterials.clear();
    this.priceRanges.forEach(r => (r.checked = false));
    this.applyFilters();
  }

  applyFilters(): void {
    let products = [...this.allProducts];

    // Search
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      products = products.filter(
        p =>
          p.nameEn.toLowerCase().includes(term) ||
          p.nameHi.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (this.selectedCategories.size > 0) {
      products = products.filter(p => this.selectedCategories.has(p.category));
    }

    // Material filter
    if (this.selectedMaterials.size > 0) {
      products = products.filter(p => this.selectedMaterials.has(p.material));
    }

    // Price range filter
    const activeRanges = this.priceRanges.filter(r => r.checked);
    if (activeRanges.length > 0) {
      products = products.filter(p =>
        activeRanges.some(r => p.price >= r.min && p.price < r.max)
      );
    }

    // Sort
    switch (this.sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        products.sort((a, b) => {
          const dateA = a.createdAt?.toMillis?.() || 0;
          const dateB = b.createdAt?.toMillis?.() || 0;
          return dateB - dateA;
        });
        break;
    }

    this.filteredProducts = products;
  }
}
