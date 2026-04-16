import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProductCardComponent,
  ],
  template: `
    <!-- Hero Section -->
    <section
      class="w-full min-h-[80vh] bg-maroon bg-cover bg-center relative"
      style="background-image: url('/assets/images/hero-bg.jpg');"
    >
      <div
        class="w-full min-h-[80vh] flex items-center justify-center"
        style="background: linear-gradient(135deg, rgba(128,0,32,0.85) 0%, rgba(212,175,55,0.7) 100%);"
      >
        <div class="text-center p-8 text-cream">
          <h1 class="text-4xl md:text-6xl font-bold mb-2" style="text-shadow: 2px 2px 8px rgba(0,0,0,0.4);">
            &#x0938;&#x094D;&#x0924;&#x094D;&#x0930;&#x0940;&#x0930;&#x0924;&#x094D;&#x0928;
          </h1>
          <p class="text-lg md:text-xl tracking-wide mb-1">Jewel of Women | &#x0938;&#x094D;&#x0924;&#x094D;&#x0930;&#x093F;&#x092F;&#x093E;&#x0902;&#x091A;&#x0947; &#x0930;&#x0924;&#x094D;&#x0928;</p>
          <p class="text-sm opacity-85 mb-8 tracking-[2px] uppercase">Powered by Maaax</p>
          <a
            routerLink="/shop"
            class="inline-block bg-gold text-maroon text-lg font-semibold px-10 py-3 rounded-full tracking-wide hover:bg-gold-light transition-colors"
          >
            Shop Now
          </a>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-12 px-4 md:px-6 max-w-[1200px] mx-auto">
      <h2 class="text-center text-2xl md:text-3xl font-bold text-maroon mb-2">Featured Collection</h2>
      <div class="w-[60px] h-[3px] bg-gold mx-auto mb-8"></div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        <app-product-card
          *ngFor="let product of featuredProducts"
          [product]="product"
        ></app-product-card>
      </div>
      <div class="text-center mt-8">
        <a
          routerLink="/shop"
          class="inline-block border-2 border-maroon text-maroon px-8 py-2 rounded-full font-medium hover:bg-maroon hover:text-cream transition-colors"
        >
          View All Products
        </a>
      </div>
    </section>

    <!-- Categories -->
    <section class="py-12 px-4 md:px-6 max-w-[1200px] mx-auto">
      <h2 class="text-center text-2xl md:text-3xl font-bold text-maroon mb-2">Shop by Category</h2>
      <div class="w-[60px] h-[3px] bg-gold mx-auto mb-8"></div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        <a
          *ngFor="let cat of categories"
          [routerLink]="['/shop', cat.id]"
          class="block text-center rounded-xl overflow-hidden bg-cream shadow-md hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/25 transition-all duration-300 pb-4 no-underline"
        >
          <div class="w-full aspect-square overflow-hidden">
            <img [src]="cat.image" [alt]="cat.nameEn" loading="lazy" class="w-full h-full object-cover" />
          </div>
          <h3 class="text-maroon mt-3 mb-1 text-lg font-semibold">{{ cat.nameEn }}</h3>
          <span class="text-rose-gold text-sm">{{ cat.nameHi }}</span>
        </a>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="py-12 px-4 md:px-6 max-w-[1200px] mx-auto">
      <h2 class="text-center text-2xl md:text-3xl font-bold text-maroon mb-2">Why Choose Us</h2>
      <div class="w-[60px] h-[3px] bg-gold mx-auto mb-8"></div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <div
          class="text-center py-8 px-4 bg-cream rounded-xl shadow-sm"
          *ngFor="let feature of features"
        >
          <span class="material-icons text-gold text-4xl mb-4">{{ feature.icon }}</span>
          <h3 class="text-maroon font-semibold mb-2">{{ feature.title }}</h3>
          <p class="text-gray-500 text-sm">{{ feature.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-12 px-4 md:px-6 max-w-[1200px] mx-auto bg-cream rounded-2xl">
      <h2 class="text-center text-2xl md:text-3xl font-bold text-maroon mb-2">What Our Customers Say</h2>
      <div class="w-[60px] h-[3px] bg-gold mx-auto mb-8"></div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-gold"
          *ngFor="let t of testimonials"
        >
          <div class="flex gap-0.5 mb-3">
            <span *ngFor="let s of [1,2,3,4,5]" class="material-icons text-gold text-base">star</span>
          </div>
          <p class="text-gray-700 italic mb-3">"{{ t.text }}"</p>
          <p class="text-rose-gold font-semibold text-sm">- {{ t.author }}, {{ t.city }}</p>
        </div>
      </div>
    </section>

    <!-- WhatsApp CTA -->
    <section
      class="text-center py-12 px-6 mx-4 md:mx-6 my-8 rounded-2xl text-cream max-w-[1200px] lg:mx-auto"
      style="background: linear-gradient(135deg, #800020, #B76E79);"
    >
      <h2 class="text-2xl font-bold text-cream mb-2">Order Now via WhatsApp</h2>
      <p class="opacity-90 mb-6">Get personalized assistance and quick delivery</p>
      <a
        href="https://wa.me/919999999999?text=Hi!%20I%20want%20to%20order%20jewelry%20from%20%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%8D%E0%A4%B0%E0%A5%80%E0%A4%B0%E0%A4%A4%E0%A5%8D%E0%A4%A8"
        target="_blank"
        class="inline-flex items-center gap-2 bg-whatsapp text-white text-lg font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
      >
        <span class="material-icons">chat</span>
        Chat on WhatsApp
      </a>
    </section>
  `,
  styles: [`
    :host { display: block; }
  `],
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  featuredProducts: Product[] = [];
  categories: Category[] = [];

  features = [
    { icon: 'verified', title: 'Premium Quality', desc: 'Every piece is handpicked and quality checked for perfection.' },
    { icon: 'local_shipping', title: 'Free Delivery', desc: 'Free shipping on all orders above \u20B9999 across India.' },
    { icon: 'inventory_2', title: 'Secure Packaging', desc: 'Beautiful gift-ready packaging with every order.' },
    { icon: 'autorenew', title: 'Easy Returns', desc: '7-day hassle-free return and exchange policy.' },
  ];

  testimonials = [
    { text: 'Beautiful necklace set! Looks exactly like the photos. Amazing quality at this price.', author: 'Priya S.', city: 'Mumbai' },
    { text: 'Ordered earrings for my sister\'s wedding. She loved them! Fast delivery too.', author: 'Sneha M.', city: 'Pune' },
    { text: 'Best artificial jewelry I\'ve ever bought. Will definitely order again!', author: 'Anjali R.', city: 'Nagpur' },
  ];

  ngOnInit(): void {
    this.productService.getFeatured().subscribe(products => {
      this.featuredProducts = products;
    });
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories.filter(c => c.isActive);
    });
  }
}
