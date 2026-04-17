import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { SettingsService } from '../../core/services/settings.service';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, CurrencyInrPipe],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  private readonly cartService = inject(CartService);
  private readonly settings = inject(SettingsService);

  readonly items = this.cartService.items;
  readonly isEmpty = this.cartService.isEmpty;
  readonly itemCount = this.cartService.itemCount;
  readonly subtotal = this.cartService.totalAmount;

  readonly freeDeliveryThreshold = this.settings.freeDeliveryThreshold;
  readonly deliveryCharge = this.settings.deliveryCharge;

  readonly hasFreeDelivery = computed(
    () => this.subtotal() >= this.freeDeliveryThreshold()
  );
  readonly amountUntilFreeDelivery = computed(
    () => this.freeDeliveryThreshold() - this.subtotal()
  );
  readonly total = computed(
    () => this.subtotal() + (this.hasFreeDelivery() ? 0 : this.deliveryCharge())
  );
  readonly deliveryLabel = computed(() => `₹${this.deliveryCharge()}`);

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
