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

import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';

type StatusFilter = 'all' | 'active' | 'hidden';
type SortKey = 'order' | 'name' | 'recent';
type ViewMode = 'grid' | 'list';

interface CategoryForm {
  name: string;
  nameMarathi: string;
  description: string;
  image: string;
  order: number;
  active: boolean;
}

interface SortOption {
  readonly value: SortKey;
  readonly label: string;
}

interface StatusChip {
  readonly value: StatusFilter;
  readonly label: string;
}

const EMPTY_FORM: CategoryForm = {
  name: '',
  nameMarathi: '',
  description: '',
  image: '',
  order: 0,
  active: true,
};

@Component({
  selector: 'app-manage-categories',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-categories.component.html',
  styleUrl: './manage-categories.component.scss',
})
export class ManageCategoriesComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly destroyRef = inject(DestroyRef);

  readonly categories = signal<Category[]>([]);
  readonly loading = signal(true);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly saving = signal(false);
  readonly toast = signal<{ message: string; tone: 'success' | 'error' } | null>(null);

  // Filter state
  readonly searchQuery = signal('');
  readonly statusFilter = signal<StatusFilter>('all');
  readonly sortKey = signal<SortKey>('order');
  readonly viewMode = signal<ViewMode>('grid');

  readonly statusChips: readonly StatusChip[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'hidden', label: 'Hidden' },
  ];

  readonly sortOptions: readonly SortOption[] = [
    { value: 'order', label: 'Display order' },
    { value: 'name', label: 'Name (A–Z)' },
    { value: 'recent', label: 'Recently added' },
  ];

  // Stats (derived)
  readonly totalCount = computed(() => this.categories().length);
  readonly activeCount = computed(
    () => this.categories().filter((c) => c.active).length
  );
  readonly hiddenCount = computed(
    () => this.categories().filter((c) => !c.active).length
  );

  // Filtering pipeline
  readonly filteredCategories = computed<readonly Category[]>(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const status = this.statusFilter();
    const sort = this.sortKey();

    let list = [...this.categories()];

    if (status === 'active') list = list.filter((c) => c.active);
    else if (status === 'hidden') list = list.filter((c) => !c.active);

    if (query) {
      list = list.filter((c) => {
        const haystack = [
          c.name,
          c.nameMarathi ?? '',
          c.description ?? '',
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(query);
      });
    }

    list.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'order') return a.order - b.order;
      return 0;
    });

    return list;
  });

  readonly hasActiveFilters = computed(
    () =>
      !!this.searchQuery().trim() ||
      this.statusFilter() !== 'all' ||
      this.sortKey() !== 'order'
  );

  readonly filteredCount = computed(() => this.filteredCategories().length);

  form: CategoryForm = { ...EMPTY_FORM };

  constructor() {
    effect(() => {
      const current = this.toast();
      if (!current) return;
      const handle = setTimeout(() => this.toast.set(null), 2800);
      this.destroyRef.onDestroy(() => clearTimeout(handle));
    });
  }

  ngOnInit(): void {
    this.categoryService
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (c) => {
          this.categories.set(c);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  openCreate(): void {
    this.resetForm();
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.resetForm();
  }

  setStatus(value: StatusFilter): void {
    this.statusFilter.set(value);
  }

  setSort(value: SortKey): void {
    this.sortKey.set(value);
  }

  setView(mode: ViewMode): void {
    this.viewMode.set(mode);
  }

  onSearchInput(value: string): void {
    this.searchQuery.set(value);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.statusFilter.set('all');
    this.sortKey.set('order');
  }

  async saveCategory(): Promise<void> {
    if (!this.form.name.trim()) {
      this.showToast('Category name is required', 'error');
      return;
    }
    if (this.saving()) return;
    this.saving.set(true);

    const payload = {
      name: this.form.name.trim(),
      nameMarathi: this.form.nameMarathi.trim() || undefined,
      description: this.form.description.trim() || undefined,
      image: this.form.image.trim() || undefined,
      order: Number(this.form.order) || 0,
      active: this.form.active,
    };

    try {
      const id = this.editingId();
      if (id) {
        await this.categoryService.updateCategory(id, payload);
        this.showToast('Category updated', 'success');
      } else {
        await this.categoryService.addCategory(payload);
        this.showToast('Category created', 'success');
      }
      await this.refresh();
      this.closeForm();
    } catch (error) {
      console.error(error);
      this.showToast('Failed to save category', 'error');
    } finally {
      this.saving.set(false);
    }
  }

  editCategory(category: Category): void {
    this.editingId.set(category.id);
    this.form = {
      name: category.name,
      nameMarathi: category.nameMarathi || '',
      description: category.description || '',
      image: category.image || '',
      order: category.order,
      active: category.active,
    };
    this.showForm.set(true);
  }

  async toggleActive(category: Category): Promise<void> {
    try {
      await this.categoryService.updateCategory(category.id, {
        active: !category.active,
      });
      await this.refresh();
      this.showToast(
        category.active ? 'Category hidden' : 'Category activated',
        'success'
      );
    } catch {
      this.showToast('Could not update status', 'error');
    }
  }

  async deleteCategory(id: string): Promise<void> {
    if (!confirm('Delete this category? This cannot be undone.')) return;
    try {
      await this.categoryService.deleteCategory(id);
      await this.refresh();
      this.showToast('Category deleted', 'success');
    } catch {
      this.showToast('Could not delete category', 'error');
    }
  }

  resetForm(): void {
    this.editingId.set(null);
    this.form = { ...EMPTY_FORM };
  }

  private async refresh(): Promise<void> {
    const data = await new Promise<Category[]>((resolve, reject) => {
      this.categoryService.getCategories().subscribe({
        next: resolve,
        error: reject,
      });
    });
    this.categories.set(data);
  }

  private showToast(message: string, tone: 'success' | 'error'): void {
    this.toast.set({ message, tone });
  }
}
