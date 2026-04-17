import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';

type SortBy = 'newest' | 'price-asc' | 'price-desc' | 'popular';
type ViewMode = 'grid' | 'list';

interface SortOption {
  readonly value: SortBy;
  readonly label: string;
}

const SORT_OPTIONS: readonly SortOption[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

const SKELETON_COUNT = 8;

@Component({
  selector: 'app-shop',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ProductCardComponent,
    SkeletonLoaderComponent,
    CurrencyInrPipe,
  ],
  templateUrl: './shop.component.html',
})
export class ShopComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly allProducts = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly loading = signal(true);
  readonly viewMode = signal<ViewMode>('grid');

  readonly searchQuery = signal('');
  readonly selectedCategory = signal('');
  readonly sortBy = signal<SortBy>('newest');

  readonly sortOptions = SORT_OPTIONS;
  readonly skeletonSlots = Array.from({ length: SKELETON_COUNT });

  readonly categoryNames = computed<Record<string, string>>(() => {
    const result: Record<string, string> = {};
    for (const cat of this.categories()) {
      result[cat.id] = cat.name;
    }
    return result;
  });

  readonly categoryCounts = computed<Record<string, number>>(() => {
    const result: Record<string, number> = {};
    for (const product of this.allProducts()) {
      result[product.categoryId] = (result[product.categoryId] ?? 0) + 1;
    }
    return result;
  });

  readonly filteredProducts = computed(() => {
    const category = this.selectedCategory();
    const query = this.searchQuery().toLowerCase().trim();
    let products = [...this.allProducts()];

    if (category) {
      products = products.filter((p) => p.categoryId === category);
    }

    if (query) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          (p.tags || []).some((t) => t.toLowerCase().includes(query))
      );
    }

    switch (this.sortBy()) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        products.sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller));
        break;
    }

    return products;
  });

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        if (params['category']) {
          this.selectedCategory.set(params['category']);
        }
      });

    this.productService
      .getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((products) => {
        this.allProducts.set(products);
        this.loading.set(false);
      });

    this.categoryService
      .getActiveCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((cats) => this.categories.set(cats));
  }

  selectCategory(id: string): void {
    this.selectedCategory.set(id);
  }

  clearAllFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('');
    this.sortBy.set('newest');
  }
}
