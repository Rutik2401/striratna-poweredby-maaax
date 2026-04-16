import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProductCardComponent,
    CurrencyInrPipe,
  ],
  template: `
    <div class="max-w-[1200px] mx-auto p-4 md:p-6" *ngIf="!loading && product">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-12">
        <!-- Image Gallery -->
        <div>
          <div class="rounded-xl overflow-hidden bg-cream aspect-square">
            <img [src]="selectedImage" [alt]="product.nameEn" class="w-full h-full object-cover" />
          </div>
          <div class="flex gap-2 mt-3 overflow-x-auto" *ngIf="product.images.length > 1">
            <button
              *ngFor="let img of product.images; let i = index"
              class="w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer p-0 bg-transparent flex-shrink-0 transition-colors"
              [class.border-gold]="selectedImage === img"
              [class.border-transparent]="selectedImage !== img"
              (click)="selectedImage = img"
            >
              <img [src]="img" [alt]="product.nameEn + ' image ' + (i + 1)" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Product Info -->
        <div>
          <h1 class="text-maroon text-2xl md:text-3xl font-bold mb-1">{{ product.nameEn }}</h1>
          <p class="text-rose-gold text-lg mb-4">{{ product.nameHi }}</p>

          <!-- Price -->
          <div class="flex items-baseline gap-3 mb-4">
            <span class="text-2xl md:text-3xl font-bold text-maroon">{{ product.price | currencyInr }}</span>
            <span class="text-lg text-gray-400 line-through" *ngIf="product.mrp > product.price">{{ product.mrp | currencyInr }}</span>
            <span
              class="bg-gold text-maroon px-2 py-0.5 rounded text-sm font-semibold"
              *ngIf="discountPercent > 0"
            >
              {{ discountPercent }}% OFF
            </span>
          </div>

          <!-- Stock Status -->
          <div class="flex items-center gap-2 mb-4 font-medium">
            <span
              class="w-2.5 h-2.5 rounded-full"
              [class.bg-green-500]="product.inStock"
              [class.bg-red-500]="!product.inStock"
            ></span>
            {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
          </div>

          <!-- Meta -->
          <div class="mb-6 text-gray-600">
            <p><strong class="text-gray-800">Material:</strong> {{ product.material }}</p>
            <p class="mt-3 leading-relaxed">{{ product.description }}</p>
          </div>

          <!-- Quantity Selector -->
          <div class="flex items-center gap-4 mb-6" *ngIf="product.inStock">
            <button
              class="w-9 h-9 rounded-full bg-gold text-maroon flex items-center justify-center font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold-light transition-colors"
              (click)="decrementQty()"
              [disabled]="quantity <= 1"
            >
              <span class="material-icons text-lg">remove</span>
            </button>
            <span class="text-xl font-semibold min-w-[2rem] text-center">{{ quantity }}</span>
            <button
              class="w-9 h-9 rounded-full bg-gold text-maroon flex items-center justify-center font-bold text-lg hover:bg-gold-light transition-colors"
              (click)="incrementQty()"
            >
              <span class="material-icons text-lg">add</span>
            </button>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col md:flex-row gap-3">
            <button
              class="flex-1 inline-flex items-center justify-center gap-2 bg-gold text-maroon text-base font-semibold py-3 px-6 rounded-full hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              (click)="addToCart()"
              [disabled]="!product.inStock"
            >
              <span class="material-icons">shopping_cart</span>
              Add to Cart
            </button>
            <a
              class="flex-1 inline-flex items-center justify-center gap-2 bg-whatsapp text-white text-base font-semibold py-3 px-6 rounded-full hover:opacity-90 transition-opacity no-underline"
              [href]="whatsappUrl"
              target="_blank"
            >
              <span class="material-icons">chat</span>
              Ask on WhatsApp
            </a>
          </div>

          <!-- Added to Cart Message -->
          <p *ngIf="addedToCart" class="flex items-center gap-2 text-green-500 font-medium mt-4">
            <span class="material-icons">check_circle</span> Added to cart!
          </p>
        </div>
      </div>

      <!-- Related Products -->
      <section *ngIf="relatedProducts.length > 0" class="mt-8">
        <h2 class="text-center text-maroon text-xl md:text-2xl font-bold mb-2">You May Also Like</h2>
        <div class="w-[60px] h-[3px] bg-gold mx-auto mb-6"></div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          <app-product-card
            *ngFor="let rp of relatedProducts"
            [product]="rp"
          ></app-product-card>
        </div>
      </section>
    </div>

    <!-- Loading State -->
    <div *ngIf="loading" class="text-center py-16 text-gray-500">
      <div class="inline-block w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
      <p>Loading product...</p>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product: Product | null = null;
  relatedProducts: Product[] = [];
  loading = true;
  selectedImage = '';
  quantity = 1;
  addedToCart = false;
  discountPercent = 0;
  whatsappUrl = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  private loadProduct(id: string): void {
    this.loading = true;
    this.addedToCart = false;
    this.quantity = 1;

    this.productService.getById(id).subscribe(product => {
      this.product = product;
      this.selectedImage = product.images[0] || '';
      this.discountPercent =
        product.mrp > product.price
          ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
          : 0;
      this.whatsappUrl = this.buildWhatsAppUrl(product);
      this.loading = false;

      // Load related products from same category
      this.productService.getAll().subscribe(all => {
        this.relatedProducts = all
          .filter(p => p.category === product.category && p.id !== product.id)
          .slice(0, 4);
      });
    });
  }

  private buildWhatsAppUrl(product: Product): string {
    const text = `Hi! I'm interested in "${product.nameEn}" priced at \u20B9${product.price}. Please share more details.`;
    return `https://wa.me/919999999999?text=${encodeURIComponent(text)}`;
  }

  incrementQty(): void {
    this.quantity++;
  }

  decrementQty(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) return;
    for (let i = 0; i < this.quantity; i++) {
      this.cartService.addToCart(this.product);
    }
    this.addedToCart = true;
    setTimeout(() => (this.addedToCart = false), 3000);
  }
}
