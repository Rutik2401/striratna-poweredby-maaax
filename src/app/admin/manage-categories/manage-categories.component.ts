import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';

interface CategoryForm {
  name: string;
  nameMarathi: string;
  description: string;
  image: string;
  order: number;
  active: boolean;
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
})
export class ManageCategoriesComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly destroyRef = inject(DestroyRef);

  readonly categories = signal<Category[]>([]);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);

  form: CategoryForm = { ...EMPTY_FORM };

  ngOnInit(): void {
    this.categoryService
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((c) => this.categories.set(c));
  }

  toggleForm(): void {
    this.showForm.update((v) => !v);
  }

  async saveCategory(): Promise<void> {
    const data = {
      name: this.form.name,
      nameMarathi: this.form.nameMarathi || undefined,
      description: this.form.description || undefined,
      image: this.form.image || undefined,
      order: this.form.order,
      active: this.form.active,
    };

    const id = this.editingId();
    if (id) {
      await this.categoryService.updateCategory(id, data);
    } else {
      await this.categoryService.addCategory(data);
    }

    this.resetForm();
    this.showForm.set(false);
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

  async deleteCategory(id: string): Promise<void> {
    if (confirm('Are you sure you want to delete this category?')) {
      await this.categoryService.deleteCategory(id);
    }
  }

  resetForm(): void {
    this.editingId.set(null);
    this.form = { ...EMPTY_FORM };
  }
}
