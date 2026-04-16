import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from '../../core/services/category.service';
import { AuthService } from '../../core/services/auth.service';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-manage-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="flex min-h-screen bg-gray-100">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-gray-200 fixed top-0 left-0 bottom-0 z-50 overflow-y-auto hidden md:block">
        <div class="py-6 px-4 text-center">
          <h2 class="text-2xl font-bold text-maroon">&#x0938;&#x094D;&#x0924;&#x094D;&#x0930;&#x0940;&#x0930;&#x0924;&#x094D;&#x0928;</h2>
          <span class="text-xs text-gray-400">Admin Panel</span>
        </div>
        <hr class="border-gray-200" />
        <nav class="mt-2">
          <a routerLink="/admin/dashboard" routerLinkActive="bg-maroon/10 text-maroon"
             class="flex items-center gap-3 px-5 py-3 text-gray-600 hover:bg-gray-50 transition">
            <span class="material-icons text-xl">dashboard</span>
            <span class="text-sm font-medium">Dashboard</span>
          </a>
          <a routerLink="/admin/orders" routerLinkActive="bg-maroon/10 text-maroon"
             class="flex items-center gap-3 px-5 py-3 text-gray-600 hover:bg-gray-50 transition">
            <span class="material-icons text-xl">receipt_long</span>
            <span class="text-sm font-medium">Orders</span>
          </a>
          <a routerLink="/admin/products" routerLinkActive="bg-maroon/10 text-maroon"
             class="flex items-center gap-3 px-5 py-3 text-gray-600 hover:bg-gray-50 transition">
            <span class="material-icons text-xl">inventory_2</span>
            <span class="text-sm font-medium">Products</span>
          </a>
          <a routerLink="/admin/categories" routerLinkActive="bg-maroon/10 text-maroon"
             class="flex items-center gap-3 px-5 py-3 text-gray-600 hover:bg-gray-50 transition">
            <span class="material-icons text-xl">category</span>
            <span class="text-sm font-medium">Categories</span>
          </a>
          <hr class="border-gray-200 my-2" />
          <a routerLink="/" class="flex items-center gap-3 px-5 py-3 text-gray-600 hover:bg-gray-50 transition">
            <span class="material-icons text-xl">storefront</span>
            <span class="text-sm font-medium">View Shop</span>
          </a>
          <button (click)="onLogout()"
                  class="flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 transition w-full text-left">
            <span class="material-icons text-xl">logout</span>
            <span class="text-sm font-medium">Logout</span>
          </button>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 md:ml-64 p-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <h1 class="text-2xl font-bold text-gray-800">Manage Categories</h1>
          <button (click)="openForm()"
                  class="inline-flex items-center gap-2 bg-maroon hover:bg-maroon-dark text-white px-4 py-2.5 rounded-lg font-medium transition text-sm">
            <span class="material-icons text-lg">add</span> Add Category
          </button>
        </div>

        <!-- Categories Table -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name (English)</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name (Hindi)</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Image</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Order</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Active</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr *ngFor="let cat of categories" class="hover:bg-gray-50 transition">
                  <td class="px-4 py-3 font-medium text-gray-800">{{ cat.nameEn }}</td>
                  <td class="px-4 py-3 text-gray-600">{{ cat.nameHi }}</td>
                  <td class="px-4 py-3">
                    <img [src]="cat.image || 'https://via.placeholder.com/50'"
                         class="w-12 h-12 object-cover rounded-md border border-gray-200"
                         [alt]="cat.nameEn"
                         onerror="this.src='https://via.placeholder.com/50'" />
                  </td>
                  <td class="px-4 py-3 text-gray-600">{{ cat.order }}</td>
                  <td class="px-4 py-3">
                    <span class="px-2.5 py-1 rounded-full text-xs font-semibold"
                          [ngClass]="cat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
                      {{ cat.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-1">
                      <button (click)="editCategory(cat)" title="Edit"
                              class="text-blue-600 hover:text-blue-800 transition p-1">
                        <span class="material-icons text-xl">edit</span>
                      </button>
                      <button (click)="confirmDelete(cat)" title="Delete"
                              class="text-red-500 hover:text-red-700 transition p-1">
                        <span class="material-icons text-xl">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div *ngIf="categories.length === 0" class="py-10 text-center text-gray-400">
            No categories yet. Click "Add Category" to create one.
          </div>
        </div>

        <!-- Add/Edit Category Modal -->
        <div *ngIf="showForm" class="fixed inset-0 bg-black/50 z-[1000] flex justify-center items-start pt-16 overflow-y-auto"
             (click)="showForm = false">
          <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto mx-4"
               (click)="$event.stopPropagation()">
            <!-- Header -->
            <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 class="text-lg font-bold text-maroon">{{ isEditing ? 'Edit Category' : 'Add New Category' }}</h2>
              <button (click)="showForm = false" class="text-gray-400 hover:text-gray-600">
                <span class="material-icons">close</span>
              </button>
            </div>
            <!-- Form -->
            <div class="p-5">
              <form (ngSubmit)="saveCategory()" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Name (English)</label>
                  <input type="text" [(ngModel)]="formData.nameEn" name="nameEn" required
                         class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-maroon focus:border-maroon" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Name (Hindi)</label>
                  <input type="text" [(ngModel)]="formData.nameHi" name="nameHi" required
                         class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-maroon focus:border-maroon" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <div class="relative">
                    <input type="text" [(ngModel)]="formData.image" name="image"
                           placeholder="https://example.com/image.jpg"
                           class="w-full px-3 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-maroon focus:border-maroon" />
                    <span class="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">image</span>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input type="number" [(ngModel)]="formData.order" name="order"
                         class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-maroon focus:border-maroon" />
                </div>

                <!-- Active toggle -->
                <div class="py-2">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" [(ngModel)]="formData.isActive" name="isActive"
                           class="w-4 h-4 text-maroon border-gray-300 rounded focus:ring-maroon" />
                    <span class="text-sm font-medium text-gray-700">Active</span>
                  </label>
                </div>

                <!-- Actions -->
                <div class="flex justify-end gap-3 pt-2">
                  <button type="button" (click)="showForm = false"
                          class="px-5 py-2.5 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                    Cancel
                  </button>
                  <button type="submit"
                          class="px-5 py-2.5 bg-maroon hover:bg-maroon-dark text-white rounded-lg text-sm font-medium transition">
                    {{ isEditing ? 'Update Category' : 'Add Category' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div *ngIf="categoryToDelete" class="fixed inset-0 bg-black/50 z-[1000] flex justify-center items-start pt-32"
             (click)="categoryToDelete = null">
          <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 mx-4"
               (click)="$event.stopPropagation()">
            <h2 class="text-lg font-bold text-red-600 mb-3">Delete Category</h2>
            <p class="text-gray-600 mb-5">Are you sure you want to delete <strong>"{{ categoryToDelete.nameEn }}"</strong>? This action cannot be undone.</p>
            <div class="flex justify-end gap-3">
              <button (click)="categoryToDelete = null"
                      class="px-5 py-2.5 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                Cancel
              </button>
              <button (click)="deleteCategory()"
                      class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [],
})
export class ManageCategoriesComponent implements OnInit, OnDestroy {
  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);
  private router = inject(Router);

  categories: Category[] = [];
  showForm = false;
  isEditing = false;
  editingCategoryId: string | null = null;
  categoryToDelete: Category | null = null;

  formData = {
    nameEn: '',
    nameHi: '',
    image: '',
    order: 0,
    isActive: true,
  };

  private subscription?: Subscription;

  ngOnInit(): void {
    this.subscription = this.categoryService.getAll().subscribe(categories => {
      this.categories = categories.sort((a, b) => a.order - b.order);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  openForm(): void {
    this.isEditing = false;
    this.editingCategoryId = null;
    this.formData = { nameEn: '', nameHi: '', image: '', order: 0, isActive: true };
    this.showForm = true;
  }

  editCategory(cat: Category): void {
    this.isEditing = true;
    this.editingCategoryId = cat.id || null;
    this.formData = {
      nameEn: cat.nameEn,
      nameHi: cat.nameHi,
      image: cat.image,
      order: cat.order,
      isActive: cat.isActive,
    };
    this.showForm = true;
  }

  async saveCategory(): Promise<void> {
    const categoryData: Category = {
      nameEn: this.formData.nameEn,
      nameHi: this.formData.nameHi,
      image: this.formData.image,
      order: this.formData.order,
      isActive: this.formData.isActive,
    };

    try {
      if (this.isEditing && this.editingCategoryId) {
        await this.categoryService.update(this.editingCategoryId, categoryData);
      } else {
        await this.categoryService.add(categoryData);
      }
      this.showForm = false;
    } catch (err) {
      console.error('Error saving category:', err);
    }
  }

  confirmDelete(cat: Category): void {
    this.categoryToDelete = cat;
  }

  async deleteCategory(): Promise<void> {
    if (this.categoryToDelete?.id) {
      try {
        await this.categoryService.delete(this.categoryToDelete.id);
      } catch (err) {
        console.error('Error deleting category:', err);
      }
    }
    this.categoryToDelete = null;
  }

  async onLogout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
