import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistItem, WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';

@Component({
  selector: 'app-favourites',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, CurrencyInrPipe],
  templateUrl: './favourites.component.html',
})
export class FavouritesComponent {
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);

  readonly items = this.wishlistService.items;
  readonly count = this.wishlistService.count;
  readonly isEmpty = this.wishlistService.isEmpty;

  removeItem(event: Event, productId: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.wishlistService.remove(productId);
  }

  moveToCart(item: WishlistItem): void {
    if (!item.inStock) return;
    this.cartService.addItem({
      productId: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
    });
    this.wishlistService.remove(item.productId);
  }

  clearAll(): void {
    if (confirm('Remove all items from favourites?')) {
      this.wishlistService.clear();
    }
  }
}
