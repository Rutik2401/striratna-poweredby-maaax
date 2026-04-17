import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CurrencyInrPipe } from '../../pipes/currency-inr.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, CurrencyInrPipe],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  readonly product = input.required<Product>();

  private readonly wishlistService = inject(WishlistService);

  readonly imageLoaded = signal(false);

  readonly wishlisted = computed(() =>
    this.wishlistService.idSet().has(this.product().id)
  );

  readonly hasDiscount = computed(() => {
    const p = this.product();
    return !!p.originalPrice && p.originalPrice > p.price;
  });

  readonly discountPercent = computed(() => {
    const p = this.product();
    if (!p.originalPrice) return 0;
    return Math.round((1 - p.price / p.originalPrice) * 100);
  });

  readonly savings = computed(() => {
    const p = this.product();
    return p.originalPrice ? p.originalPrice - p.price : 0;
  });

  onImageLoad(): void {
    this.imageLoaded.set(true);
  }

  toggleWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const p = this.product();
    this.wishlistService.toggle({
      productId: p.id,
      name: p.name,
      image: p.images[0],
      price: p.price,
      originalPrice: p.originalPrice,
      categoryName: p.categoryName,
      inStock: p.inStock,
    });
  }
}
