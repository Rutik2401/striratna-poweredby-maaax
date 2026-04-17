import { Injectable, signal, computed, effect } from '@angular/core';

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

const CART_KEY = 'striratna_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems = signal<CartItem[]>(this.loadFromStorage());

  readonly items = this.cartItems.asReadonly();
  readonly itemCount = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );
  readonly totalAmount = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );
  readonly isEmpty = computed(() => this.cartItems().length === 0);

  constructor() {
    effect(() => {
      localStorage.setItem(CART_KEY, JSON.stringify(this.cartItems()));
    });
  }

  addItem(item: Omit<CartItem, 'quantity'>, quantity = 1): void {
    const current = this.cartItems();
    const existingIndex = current.findIndex((i) => i.productId === item.productId);

    if (existingIndex >= 0) {
      const updated = [...current];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + quantity,
      };
      this.cartItems.set(updated);
    } else {
      this.cartItems.set([...current, { ...item, quantity }]);
    }
  }

  removeItem(productId: string): void {
    this.cartItems.set(this.cartItems().filter((i) => i.productId !== productId));
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    const updated = this.cartItems().map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    this.cartItems.set(updated);
  }

  clearCart(): void {
    this.cartItems.set([]);
  }

  private loadFromStorage(): CartItem[] {
    try {
      const data = localStorage.getItem(CART_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}
