import { Injectable, computed, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

const CART_STORAGE_KEY = 'streeratna_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.loadCart());
  readonly cartItems$ = this.cartItemsSubject.asObservable();

  readonly cartCount$ = this.cartItems$.pipe(
    map(items => items.reduce((sum, item) => sum + item.quantity, 0))
  );

  readonly cartTotal$ = this.cartItems$.pipe(
    map(items => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0))
  );

  // Signal-based API for use in templates and computed properties
  private _items = signal<CartItem[]>(this.loadCart());
  readonly items = this._items.asReadonly();
  readonly total = computed(() =>
    this._items().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );
  readonly count = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.getValue();
  }

  getCartTotal(): number {
    return this.getCartItems().reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  getCartCount(): number {
    return this.getCartItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  addToCart(product: Product, quantity: number = 1): void {
    const items = [...this.getCartItems()];
    const index = items.findIndex(item => item.product.id === product.id);

    if (index > -1) {
      items[index] = { ...items[index], quantity: items[index].quantity + quantity };
    } else {
      items.push({ product, quantity });
    }

    this.updateCart(items);
  }

  removeFromCart(productId: string): void {
    const items = this.getCartItems().filter(item => item.product.id !== productId);
    this.updateCart(items);
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const items = [...this.getCartItems()];
    const index = items.findIndex(item => item.product.id === productId);

    if (index > -1) {
      items[index] = { ...items[index], quantity };
      this.updateCart(items);
    }
  }

  clearCart(): void {
    this.updateCart([]);
  }

  private updateCart(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
    this._items.set(items);
    this.saveCart(items);
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }

  private loadCart(): CartItem[] {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}
