import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { WhatsappService } from '../../core/services/whatsapp.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { Product } from '../../core/models/product.model';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';

const MIN_ZOOM = 1.2;
const MAX_ZOOM = 4;
const DEFAULT_ZOOM = 1.8;
const ZOOM_STEP = 0.4;
const ADDED_FEEDBACK_MS = 2000;

const FREE_DELIVERY_THRESHOLD = 999;
const DELIVERY_CHARGE = 99;

@Component({
  selector: 'app-product-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, CurrencyInrPipe, SkeletonLoaderComponent],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly whatsappService = inject(WhatsappService);
  private readonly destroyRef = inject(DestroyRef);

  readonly product = signal<Product | null>(null);
  readonly selectedImage = signal('');
  readonly quantity = signal(1);
  readonly loading = signal(true);
  readonly addedToCart = signal(false);
  readonly isZooming = signal(false);
  readonly zoomPosition = signal('50% 50%');
  readonly zoomLevel = signal(DEFAULT_ZOOM);
  readonly showPriceBreakup = signal(false);
  readonly showDetails = signal(true);
  readonly shareCopied = signal(false);

  readonly minZoom = MIN_ZOOM;
  readonly maxZoom = MAX_ZOOM;

  readonly wishlisted = computed(() => {
    const p = this.product();
    return p ? this.wishlistService.idSet().has(p.id) : false;
  });

  readonly hasDiscount = computed(() => {
    const p = this.product();
    return !!p?.originalPrice && p.originalPrice > p.price;
  });

  readonly discountPercent = computed(() => {
    const p = this.product();
    if (!p?.originalPrice) return 0;
    return Math.round((1 - p.price / p.originalPrice) * 100);
  });

  readonly savings = computed(() => {
    const p = this.product();
    return p?.originalPrice ? p.originalPrice - p.price : 0;
  });

  readonly lineSubtotal = computed(() => {
    const p = this.product();
    return p ? p.price * this.quantity() : 0;
  });

  readonly hasFreeDelivery = computed(() => this.lineSubtotal() >= FREE_DELIVERY_THRESHOLD);

  readonly deliveryCharge = computed(() =>
    this.hasFreeDelivery() ? 0 : DELIVERY_CHARGE
  );

  readonly grandTotal = computed(() => this.lineSubtotal() + this.deliveryCharge());

  readonly hasSpecs = computed(() => {
    const p = this.product();
    return !!(p?.material || p?.weight || p?.dimensions);
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading.set(false);
      return;
    }

    this.productService
      .getProductById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((product) => {
        if (product) {
          this.product.set(product);
          this.selectedImage.set(product.images[0]);
        }
        this.loading.set(false);
      });
  }

  onMouseMove(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    this.zoomPosition.set(`${x}% ${y}%`);
  }

  zoomIn(event: Event): void {
    event.stopPropagation();
    this.zoomLevel.update((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(1)));
  }

  zoomOut(event: Event): void {
    event.stopPropagation();
    this.zoomLevel.update((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(1)));
  }

  resetZoom(event: Event): void {
    event.stopPropagation();
    this.zoomLevel.set(DEFAULT_ZOOM);
  }

  incrementQuantity(): void {
    this.quantity.update((q) => q + 1);
  }

  decrementQuantity(): void {
    this.quantity.update((q) => (q > 1 ? q - 1 : q));
  }

  togglePriceBreakup(): void {
    this.showPriceBreakup.update((v) => !v);
  }

  toggleDetails(): void {
    this.showDetails.update((v) => !v);
  }

  toggleWishlist(): void {
    const p = this.product();
    if (!p) return;
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

  async shareProduct(): Promise<void> {
    const p = this.product();
    if (!p) return;
    const url = window.location.href;
    const shareData: ShareData = {
      title: p.name,
      text: `Check out ${p.name} on स्त्रीरत्न`,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        /* user cancelled — fall through to clipboard */
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      this.shareCopied.set(true);
      setTimeout(() => this.shareCopied.set(false), 2000);
    } catch {
      /* clipboard blocked — nothing we can do */
    }
  }

  addToCart(product: Product): void {
    this.cartService.addItem(
      {
        productId: product.id,
        name: product.name,
        image: product.images[0],
        price: product.price,
      },
      this.quantity()
    );
    this.addedToCart.set(true);
    setTimeout(() => this.addedToCart.set(false), ADDED_FEEDBACK_MS);
  }

  inquireWhatsApp(product: Product): void {
    this.whatsappService.sendInquiry(product.name, product.price);
  }
}
