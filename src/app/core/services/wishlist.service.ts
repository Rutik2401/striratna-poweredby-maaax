import { Injectable, computed, effect, signal } from '@angular/core';

export interface WishlistItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  categoryName?: string;
  inStock: boolean;
}

const STORAGE_KEY = 'striratna_wishlist';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly itemsSignal = signal<WishlistItem[]>(this.loadFromStorage());

  readonly items = this.itemsSignal.asReadonly();
  readonly count = computed(() => this.itemsSignal().length);
  readonly isEmpty = computed(() => this.itemsSignal().length === 0);
  readonly idSet = computed(() => new Set(this.itemsSignal().map((i) => i.productId)));

  constructor() {
    effect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.itemsSignal()));
      } catch {
        /* ignore quota errors */
      }
    });
  }

  has(productId: string): boolean {
    return this.idSet().has(productId);
  }

  add(item: WishlistItem): void {
    if (this.has(item.productId)) return;
    this.itemsSignal.set([...this.itemsSignal(), item]);
  }

  remove(productId: string): void {
    this.itemsSignal.set(this.itemsSignal().filter((i) => i.productId !== productId));
  }

  toggle(item: WishlistItem): boolean {
    if (this.has(item.productId)) {
      this.remove(item.productId);
      return false;
    }
    this.add(item);
    return true;
  }

  clear(): void {
    this.itemsSignal.set([]);
  }

  private loadFromStorage(): WishlistItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}
