import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyInrPipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h2 class="font-heading text-xl font-bold text-gray-900">Products</h2>
        <button (click)="showForm.set(!showForm())"
          class="px-5 py-2.5 bg-maroon text-white text-sm font-semibold rounded-full
                 hover:bg-maroon-dark transition-colors">
          {{ showForm() ? 'Cancel' : '+ Add Product' }}
        </button>
      </div>

      <!-- Add/Edit Form -->
      @if (showForm()) {
        <div class="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h3 class="font-heading text-lg font-semibold">
            {{ editingId() ? 'Edit Product' : 'Add New Product' }}
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" [(ngModel)]="form.name"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-gold/50" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select [(ngModel)]="form.categoryId"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-gold/50">
                <option value="">Select category</option>
                @for (cat of categories(); track cat.id) {
                  <option [value]="cat.id">{{ cat.name }}</option>
                }
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <input type="number" [(ngModel)]="form.price"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-gold/50" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
              <input type="number" [(ngModel)]="form.originalPrice"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-gold/50" />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea [(ngModel)]="form.description" rows="3"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none
                       focus:outline-none focus:ring-2 focus:ring-gold/50"></textarea>
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Image URLs (comma separated)</label>
              <input type="text" [(ngModel)]="form.imagesStr"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="https://image1.jpg, https://image2.jpg" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Material</label>
              <input type="text" [(ngModel)]="form.material"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-gold/50" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Weight</label>
              <input type="text" [(ngModel)]="form.weight"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-gold/50" />
            </div>
          </div>
          <div class="flex items-center gap-6 flex-wrap">
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" [(ngModel)]="form.inStock" class="rounded" />
              In Stock
            </label>
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" [(ngModel)]="form.featured" class="rounded" />
              Featured
            </label>
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" [(ngModel)]="form.bestSeller" class="rounded" />
              Best Seller
            </label>
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" [(ngModel)]="form.newArrival" class="rounded" />
              New Arrival
            </label>
          </div>
          <div class="flex gap-3">
            <button (click)="saveProduct()"
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

      <!-- Product List -->
      <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
        @if (products().length === 0) {
          <div class="p-8 text-center text-gray-500 text-sm">No products found. Add your first product!</div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tags</th>
                  <th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                @for (product of products(); track product.id) {
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        @if (product.images[0]) {
                          <img [src]="product.images[0]" class="w-10 h-10 rounded-lg object-cover" />
                        }
                        <div>
                          <p class="text-sm font-medium text-gray-900">{{ product.name }}</p>
                          <p class="text-xs text-gray-500">{{ product.categoryName }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm font-semibold">{{ product.price | inr }}</td>
                    <td class="px-6 py-4">
                      <span class="px-2.5 py-1 text-xs font-semibold rounded-full"
                            [class]="product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                        {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex gap-1 flex-wrap">
                        @if (product.featured) {
                          <span class="px-2 py-0.5 text-[10px] bg-gold/10 text-gold rounded-full">Featured</span>
                        }
                        @if (product.bestSeller) {
                          <span class="px-2 py-0.5 text-[10px] bg-maroon/10 text-maroon rounded-full">Bestseller</span>
                        }
                        @if (product.newArrival) {
                          <span class="px-2 py-0.5 text-[10px] bg-blue-100 text-blue-800 rounded-full">New</span>
                        }
                      </div>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <button (click)="editProduct(product)"
                          class="p-2 text-gray-400 hover:text-maroon transition-colors" title="Edit">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button (click)="deleteProduct(product.id)"
                          class="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
})
export class ManageProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  showForm = signal(false);
  editingId = signal<string | null>(null);

  form = {
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

  ngOnInit(): void {
    this.productService.getProducts().subscribe((p) => this.products.set(p));
    this.categoryService.getCategories().subscribe((c) => this.categories.set(c));
  }

  async saveProduct(): Promise<void> {
    const images = this.form.imagesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const data: any = {
      name: this.form.name,
      description: this.form.description,
      price: this.form.price,
      originalPrice: this.form.originalPrice || undefined,
      categoryId: this.form.categoryId,
      categoryName: this.categories().find((c) => c.id === this.form.categoryId)?.name || '',
      images,
      material: this.form.material || undefined,
      weight: this.form.weight || undefined,
      inStock: this.form.inStock,
      featured: this.form.featured,
      bestSeller: this.form.bestSeller,
      newArrival: this.form.newArrival,
    };

    if (this.editingId()) {
      await this.productService.updateProduct(this.editingId()!, data);
    } else {
      await this.productService.addProduct(data);
    }

    this.resetForm();
    this.showForm.set(false);
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

  async deleteProduct(id: string): Promise<void> {
    if (confirm('Are you sure you want to delete this product?')) {
      await this.productService.deleteProduct(id);
    }
  }

  resetForm(): void {
    this.editingId.set(null);
    this.form = {
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
  }
}
