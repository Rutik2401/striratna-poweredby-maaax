import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';

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
})
export class ManageProductsComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly destroyRef = inject(DestroyRef);

  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);

  form: ProductForm = { ...EMPTY_FORM };

  ngOnInit(): void {
    this.productService
      .getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((p) => this.products.set(p));

    this.categoryService
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((c) => this.categories.set(c));
  }

  toggleForm(): void {
    this.showForm.update((v) => !v);
  }

  async saveProduct(): Promise<void> {
    const images = this.form.imagesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const data = {
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

    const id = this.editingId();
    if (id) {
      await this.productService.updateProduct(id, data);
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
    this.form = { ...EMPTY_FORM };
  }
}
