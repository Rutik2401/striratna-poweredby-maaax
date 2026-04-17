import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';

type StockFilter = 'all' | 'in' | 'out';
type TagFilter = 'all' | 'featured' | 'bestseller' | 'new';
type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'name';

interface ProductForm {
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  categoryId: string;
  imagesStr: string;
  material: string;
  weight: string;
  inStock: boolean;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
}

interface StockChip {
  readonly value: StockFilter;
  readonly label: string;
}

interface TagChip {
  readonly value: TagFilter;
  readonly label: string;
}

interface SortOption {
  readonly value: SortKey;
  readonly label: string;
}

const EMPTY_FORM: ProductForm = {
  name: '',
  description: '',
  price: 0,
  originalPrice: 0,
  categoryId: '',
  imagesStr: '',
  material: '',
  weight: '',
  inStock: true,
  featured: false,
  bestSeller: false,
  newArrival: false,
};

@Component({
  selector: 'app-manage-products',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, CurrencyInrPipe],
  templateUrl: './manage-products.component.html',
  styleUrl: './manage-products.component.scss',
})
export class ManageProductsComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly destroyRef = inject(DestroyRef);

  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly loading = signal(true);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly saving = signal(false);
  readonly toast = signal<{ message: string; tone: 'success' | 'error' } | null>(null);

  // Filters
  readonly searchQuery = signal('');
  readonly categoryFilter = signal<string>('all');
  readonly stockFilter = signal<StockFilter>('all');
  readonly tagFilter = signal<TagFilter>('all');
  readonly sortKey = signal<SortKey>('newest');

  readonly stockChips: readonly StockChip[] = [
    { value: 'all', label: 'All stock' },
    { value: 'in', label: 'In stock' },
    { value: 'out', label: 'Out of stock' },
  ];

  readonly tagChips: readonly TagChip[] = [
    { value: 'all', label: 'All' },
    { value: 'featured', label: 'Featured' },
    { value: 'bestseller', label: 'Bestseller' },
    { value: 'new', label: 'New arrival' },
  ];

  readonly sortOptions: readonly SortOption[] = [
    { value: 'newest', label: 'Newest first' },
    { value: 'price-asc', label: 'Price: low to high' },
    { value: 'price-desc', label: 'Price: high to low' },
    { value: 'name', label: 'Name (A–Z)' },
  ];

  // Stats
  readonly totalCount = computed(() => this.products().length);
  readonly inStockCount = computed(
    () => this.products().filter((p) => p.inStock).length
  );
  readonly outOfStockCount = computed(
    () => this.products().filter((p) => !p.inStock).length
  );
  readonly featuredCount = computed(
    () => this.products().filter((p) => p.featured).length
  );

  // Filtering pipeline
  readonly filteredProducts = computed<readonly Product[]>(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const cat = this.categoryFilter();
    const stock = this.stockFilter();
    const tag = this.tagFilter();
    const sort = this.sortKey();

    let list = [...this.products()];

    if (cat !== 'all') list = list.filter((p) => p.categoryId === cat);

    if (stock === 'in') list = list.filter((p) => p.inStock);
    else if (stock === 'out') list = list.filter((p) => !p.inStock);

    if (tag === 'featured') list = list.filter((p) => p.featured);
    else if (tag === 'bestseller') list = list.filter((p) => p.bestSeller);
    else if (tag === 'new') list = list.filter((p) => p.newArrival);

    if (query) {
      list = list.filter((p) => {
        const haystack = [
          p.name,
          p.nameMarathi ?? '',
          p.description,
          p.material ?? '',
          p.categoryName ?? '',
          ...(p.tags ?? []),
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(query);
      });
    }

    list.sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'name') return a.name.localeCompare(b.name);
      // newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return list;
  });

  readonly hasActiveFilters = computed(
    () =>
      !!this.searchQuery().trim() ||
      this.categoryFilter() !== 'all' ||
      this.stockFilter() !== 'all' ||
      this.tagFilter() !== 'all' ||
      this.sortKey() !== 'newest'
  );

  readonly filteredCount = computed(() => this.filteredProducts().length);

  form: ProductForm = { ...EMPTY_FORM };

  constructor() {
    effect(() => {
      const current = this.toast();
      if (!current) return;
      const handle = setTimeout(() => this.toast.set(null), 2800);
      this.destroyRef.onDestroy(() => clearTimeout(handle));
    });
  }

  ngOnInit(): void {
    this.productService
      .getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (p) => {
          this.products.set(p);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });

    this.categoryService
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((c) => this.categories.set(c));
  }

  openCreate(): void {
    this.resetForm();
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.resetForm();
  }

  onSearchInput(value: string): void {
    this.searchQuery.set(value);
  }

  setCategory(value: string): void {
    this.categoryFilter.set(value);
  }

  setStock(value: StockFilter): void {
    this.stockFilter.set(value);
  }

  setTag(value: TagFilter): void {
    this.tagFilter.set(value);
  }

  setSort(value: SortKey): void {
    this.sortKey.set(value);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.categoryFilter.set('all');
    this.stockFilter.set('all');
    this.tagFilter.set('all');
    this.sortKey.set('newest');
  }

  async saveProduct(): Promise<void> {
    if (!this.form.name.trim() || !this.form.categoryId || this.form.price <= 0) {
      this.showToast('Name, category and a valid price are required', 'error');
      return;
    }
    if (this.saving()) return;
    this.saving.set(true);

    const images = this.form.imagesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: this.form.name.trim(),
      description: this.form.description.trim(),
      price: Number(this.form.price),
      originalPrice: Number(this.form.originalPrice) || undefined,
      categoryId: this.form.categoryId,
      categoryName:
        this.categories().find((c) => c.id === this.form.categoryId)?.name || '',
      images,
      material: this.form.material.trim() || undefined,
      weight: this.form.weight.trim() || undefined,
      inStock: this.form.inStock,
      featured: this.form.featured,
      bestSeller: this.form.bestSeller,
      newArrival: this.form.newArrival,
    };

    try {
      const id = this.editingId();
      if (id) {
        await this.productService.updateProduct(id, payload);
        this.showToast('Product updated', 'success');
      } else {
        await this.productService.addProduct(payload);
        this.showToast('Product created', 'success');
      }
      await this.refresh();
      this.closeForm();
    } catch (error) {
      console.error(error);
      this.showToast('Failed to save product', 'error');
    } finally {
      this.saving.set(false);
    }
  }

  editProduct(product: Product): void {
    this.editingId.set(product.id);
    this.form = {
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      categoryId: product.categoryId,
      imagesStr: product.images.join(', '),
      material: product.material || '',
      weight: product.weight || '',
      inStock: product.inStock,
      featured: product.featured,
      bestSeller: product.bestSeller,
      newArrival: product.newArrival,
    };
    this.showForm.set(true);
  }

  async toggleStock(product: Product): Promise<void> {
    try {
      await this.productService.updateProduct(product.id, {
        inStock: !product.inStock,
      });
      await this.refresh();
      this.showToast(
        product.inStock ? 'Marked out of stock' : 'Marked in stock',
        'success'
      );
    } catch {
      this.showToast('Could not update stock', 'error');
    }
  }

  async deleteProduct(id: string): Promise<void> {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    try {
      await this.productService.deleteProduct(id);
      await this.refresh();
      this.showToast('Product deleted', 'success');
    } catch {
      this.showToast('Could not delete product', 'error');
    }
  }

  resetForm(): void {
    this.editingId.set(null);
    this.form = { ...EMPTY_FORM };
  }

  private async refresh(): Promise<void> {
    const data = await new Promise<Product[]>((resolve, reject) => {
      this.productService.getProducts().subscribe({ next: resolve, error: reject });
    });
    this.products.set(data);
  }

  private showToast(message: string, tone: 'success' | 'error'): void {
    this.toast.set({ message, tone });
  }
}
