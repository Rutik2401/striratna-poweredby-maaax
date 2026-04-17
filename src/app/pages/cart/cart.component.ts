import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';

const FREE_DELIVERY_THRESHOLD = 999;
const DELIVERY_CHARGE = 99;

@Component({
  selector: 'app-cart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, CurrencyInrPipe],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  private readonly cartService = inject(CartService);

  readonly items = this.cartService.items;
  readonly isEmpty = this.cartService.isEmpty;
  readonly itemCount = this.cartService.itemCount;
  readonly subtotal = this.cartService.totalAmount;

  readonly hasFreeDelivery = computed(() => this.subtotal() >= FREE_DELIVERY_THRESHOLD);
  readonly amountUntilFreeDelivery = computed(() => FREE_DELIVERY_THRESHOLD - this.subtotal());
  readonly total = computed(() => this.subtotal() + (this.hasFreeDelivery() ? 0 : DELIVERY_CHARGE));

  readonly deliveryLabel = `₹${DELIVERY_CHARGE}`;

  updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: string): void {
    this.cartService.removeItem(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}
