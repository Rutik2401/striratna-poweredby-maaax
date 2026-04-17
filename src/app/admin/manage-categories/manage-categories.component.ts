import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-manage-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="font-heading text-xl font-bold text-gray-900">Categories</h2>
        <button (click)="showForm.set(!showForm())"
          class="px-5 py-2.5 bg-maroon text-white text-sm font-semibold rounded-full
                 hover:bg-maroon-dark transition-colors">
          {{ showForm() ? 'Cancel' : '+ Add Category' }}
        </button>
      </div>

      <!-- Form -->
      @if (showForm()) {
        <div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h3 class="font-heading text-lg font-semibold">
            {{ editingId() ? 'Edit Category' : 'Add New Category' }}
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" [(ngModel)]="form.name"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-gold/50" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name (Marathi)</label>
              <input type="text" [(ngModel)]="form.nameMarathi"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-gold/50" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input type="text" [(ngModel)]="form.image"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-gold/50" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
              <input type="number" [(ngModel)]="form.order"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-gold/50" />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea [(ngModel)]="form.description" rows="2"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none
                       focus:outline-none focus:ring-2 focus:ring-gold/50"></textarea>
            </div>
          </div>
          <label class="flex items-center gap-2 text-sm">
            <input type="checkbox" [(ngModel)]="form.active" class="rounded" />
            Active
          </label>
          <div class="flex gap-3">
            <button (click)="saveCategory()"
              class="px-6 py-2.5 bg-maroon text-white text-sm font-semibold rounded-full
                     hover:bg-maroon-dark transition-colors">
              {{ editingId() ? 'Update' : 'Save' }}
            </button>
            <button (click)="resetForm()"
              class="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full
                     hover:bg-gray-200 transition-colors">
              Reset
            </button>
          </div>
        </div>
      }

      <!-- Categories Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (category of categories(); track category.id) {
          <div class="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                @if (category.image) {
                  <img [src]="category.image" class="w-12 h-12 rounded-xl object-cover" />
                } @else {
                  <div class="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                    <span class="font-heading text-lg text-gold">{{ category.name.charAt(0) }}</span>
                  </div>
                }
                <div>
                  <h3 class="text-sm font-semibold text-gray-900">{{ category.name }}</h3>
                  @if (category.nameMarathi) {
                    <p class="text-xs text-gray-500">{{ category.nameMarathi }}</p>
                  }
                </div>
              </div>
              <span class="px-2 py-0.5 text-[10px] font-semibold rounded-full"
                    [class]="category.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'">
                {{ category.active ? 'Active' : 'Hidden' }}
              </span>
            </div>
            @if (category.description) {
              <p class="text-xs text-gray-500 mt-3">{{ category.description }}</p>
            }
            <div class="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
              <button (click)="editCategory(category)"
                class="text-xs text-maroon hover:underline">Edit</button>
              <span class="text-gray-300">|</span>
              <button (click)="deleteCategory(category.id)"
                class="text-xs text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        }
      </div>

      @if (categories().length === 0) {
        <div class="text-center py-12 text-gray-500 text-sm">
          No categories yet. Add your first category!
        </div>
      }
    </div>
  `,
})
export class ManageCategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);

  categories = signal<Category[]>([]);
  showForm = signal(false);
  editingId = signal<string | null>(null);

  form = {
    name: '',
    nameMarathi: '',
    description: '',
    image: '',
    order: 0,
    active: true,
  };

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((c) => this.categories.set(c));
  }

  async saveCategory(): Promise<void> {
    const data: any = {
      name: this.form.name,
      nameMarathi: this.form.nameMarathi || undefined,
      description: this.form.description || undefined,
      image: this.form.image || undefined,
      order: this.form.order,
      active: this.form.active,
    };

    if (this.editingId()) {
      await this.categoryService.updateCategory(this.editingId()!, data);
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
    this.form = { name: '', nameMarathi: '', description: '', image: '', order: 0, active: true };
  }
}
