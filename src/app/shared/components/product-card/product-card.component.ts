import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { CurrencyInrPipe } from '../../pipes/currency-inr.pipe';

const ADDED_FEEDBACK_MS = 1500;

@Component({
  selector: 'app-product-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, CurrencyInrPipe],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  readonly product = input.required<Product>();

  private readonly cartService = inject(CartService);

  readonly imageLoaded = signal(false);
  readonly addedToCart = signal(false);
  readonly wishlisted = signal(false);

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

  addToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const p = this.product();
    this.cartService.addItem({
      productId: p.id,
      name: p.name,
      image: p.images[0],
      price: p.price,
    });
    this.addedToCart.set(true);
    setTimeout(() => this.addedToCart.set(false), ADDED_FEEDBACK_MS);
  }

  toggleWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.wishlisted.update((v) => !v);
  }
}
