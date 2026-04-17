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
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';

interface CategoryVisual {
  readonly emoji: string;
  readonly gradient: string;
  readonly accent: string;
  readonly image?: string;
}

interface CategoryTile {
  readonly id: string;
  readonly name: string;
  readonly nameMarathi?: string;
  readonly routerLink: string[];
  readonly queryParams?: Record<string, string>;
  readonly visual: CategoryVisual;
  readonly badge?: string;
  readonly badgeTone?: 'gold' | 'maroon' | 'green';
}

interface TrustStat {
  readonly value: string;
  readonly label: string;
}

interface Feature {
  readonly icon: string;
  readonly title: string;
  readonly subtitle: string;
}

interface Occasion {
  readonly label: string;
  readonly emoji: string;
  readonly description: string;
  readonly tag: string;
  readonly gradient: string;
}

interface Reason {
  readonly icon: string;
  readonly title: string;
  readonly description: string;
  readonly tint: string;
}

interface Step {
  readonly number: number;
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

interface Testimonial {
  readonly name: string;
  readonly initials: string;
  readonly location: string;
  readonly quote: string;
  readonly avatar: string;
}

interface InstaTile {
  readonly emoji: string;
  readonly bg: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ProductCardComponent,
    SkeletonLoaderComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly destroyRef = inject(DestroyRef);

  readonly featuredProducts = signal<Product[]>([]);
  readonly bestSellers = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly loading = signal(true);

  readonly liveViewers = signal<number>(this.randomBetween(42, 118));
  readonly subscribed = signal(false);
  email = '';

  readonly skeletonCount = Array.from({ length: 8 });

  // Premium fallback visuals mapped by normalised category name
  private readonly categoryVisualMap: ReadonlyMap<string, CategoryVisual> = new Map([
    ['necklace', {
      emoji: '📿',
      gradient: 'linear-gradient(135deg, #800020 0%, #A0334D 55%, #600018 100%)',
      accent: '#D4AF37',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80',
    }],
    ['haar', {
      emoji: '📿',
      gradient: 'linear-gradient(135deg, #800020 0%, #A0334D 55%, #600018 100%)',
      accent: '#D4AF37',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    }],
    ['earring', {
      emoji: '💎',
      gradient: 'linear-gradient(135deg, #B8960F 0%, #D4AF37 55%, #800020 100%)',
      accent: '#ffffff',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    }],
    ['earrings', {
      emoji: '💎',
      gradient: 'linear-gradient(135deg, #B8960F 0%, #D4AF37 55%, #800020 100%)',
      accent: '#ffffff',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    }],
    ['bangle', {
      emoji: '⚪',
      gradient: 'linear-gradient(135deg, #A0334D 0%, #D4AF37 100%)',
      accent: '#ffffff',
      image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80',
    }],
    ['bangles', {
      emoji: '⚪',
      gradient: 'linear-gradient(135deg, #A0334D 0%, #D4AF37 100%)',
      accent: '#ffffff',
      image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80',
    }],
    ['bracelet', {
      emoji: '🔗',
      gradient: 'linear-gradient(135deg, #600018 0%, #D4AF37 100%)',
      accent: '#ffffff',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80',
    }],
    ['ring', {
      emoji: '💍',
      gradient: 'linear-gradient(135deg, #D4AF37 0%, #B8960F 55%, #600018 100%)',
      accent: '#ffffff',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    }],
    ['rings', {
      emoji: '💍',
      gradient: 'linear-gradient(135deg, #D4AF37 0%, #B8960F 55%, #600018 100%)',
      accent: '#ffffff',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    }],
    ['nath', {
      emoji: '👑',
      gradient: 'linear-gradient(135deg, #800020 0%, #D4AF37 100%)',
      accent: '#ffffff',
      image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80',
    }],
    ['mangalsutra', {
      emoji: '🖤',
      gradient: 'linear-gradient(135deg, #1a1a1a 0%, #800020 100%)',
      accent: '#D4AF37',
      image: 'https://images.unsplash.com/photo-1602751584554-86e5e4e30dc4?auto=format&fit=crop&w=800&q=80',
    }],
    ['anklet', {
      emoji: '🌙',
      gradient: 'linear-gradient(135deg, #A0334D 0%, #600018 100%)',
      accent: '#D4AF37',
      image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80',
    }],
    ['payal', {
      emoji: '🌙',
      gradient: 'linear-gradient(135deg, #A0334D 0%, #600018 100%)',
      accent: '#D4AF37',
      image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80',
    }],
    ['pendant', {
      emoji: '✨',
      gradient: 'linear-gradient(135deg, #800020 0%, #B8960F 100%)',
      accent: '#ffffff',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    }],
    ['set', {
      emoji: '👑',
      gradient: 'linear-gradient(135deg, #600018 0%, #D4AF37 100%)',
      accent: '#ffffff',
      image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80',
    }],
  ]);

  private readonly defaultCategoryVisuals: readonly CategoryVisual[] = [
    {
      emoji: '💎',
      gradient: 'linear-gradient(135deg, #800020 0%, #A0334D 55%, #600018 100%)',
      accent: '#D4AF37',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    },
    {
      emoji: '✨',
      gradient: 'linear-gradient(135deg, #B8960F 0%, #D4AF37 55%, #800020 100%)',
      accent: '#ffffff',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80',
    },
    {
      emoji: '👑',
      gradient: 'linear-gradient(135deg, #A0334D 0%, #D4AF37 100%)',
      accent: '#ffffff',
      image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80',
    },
  ];

  // Two curated promo tiles always appended after DB categories
  private readonly promoTiles: readonly CategoryTile[] = [
    {
      id: 'promo-new-arrivals',
      name: 'New Arrivals',
      nameMarathi: 'नवीन आगमन',
      routerLink: ['/shop'],
      queryParams: { sort: 'newest' },
      badge: 'Just Dropped',
      badgeTone: 'gold',
      visual: {
        emoji: '🌟',
        gradient: 'linear-gradient(135deg, #D4AF37 0%, #B8960F 50%, #800020 100%)',
        accent: '#ffffff',
        image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80',
      },
    },
    {
      id: 'promo-sale',
      name: 'Festive Sale',
      nameMarathi: 'सणाची सूट',
      routerLink: ['/shop'],
      queryParams: { sale: 'true' },
      badge: 'Up to 40% off',
      badgeTone: 'maroon',
      visual: {
        emoji: '🔥',
        gradient: 'linear-gradient(135deg, #600018 0%, #800020 50%, #D4AF37 100%)',
        accent: '#ffffff',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
      },
    },
  ];

  readonly displayCategories = computed<readonly CategoryTile[]>(() => {
    const dbTiles: CategoryTile[] = this.categories().map((category, index) => {
      const key = (category.name || '').trim().toLowerCase();
      const visualFromMap = this.categoryVisualMap.get(key);
      const fallback = this.defaultCategoryVisuals[index % this.defaultCategoryVisuals.length];
      const resolvedVisual: CategoryVisual = {
        emoji: visualFromMap?.emoji ?? fallback.emoji,
        gradient: visualFromMap?.gradient ?? fallback.gradient,
        accent: visualFromMap?.accent ?? fallback.accent,
        image: category.image || visualFromMap?.image || fallback.image,
      };
      return {
        id: category.id,
        name: category.name,
        nameMarathi: category.nameMarathi,
        routerLink: ['/shop'],
        queryParams: { category: category.id },
        visual: resolvedVisual,
      };
    });
    return [...dbTiles, ...this.promoTiles];
  });

  readonly heroAvatars: readonly string[] = [
    'linear-gradient(135deg, #D4AF37, #B8960F)',
    'linear-gradient(135deg, #800020, #A0334D)',
    'linear-gradient(135deg, #E8CC6E, #D4AF37)',
    'linear-gradient(135deg, #600018, #800020)',
  ];

  readonly trustStats: readonly TrustStat[] = [
    { value: '10,000+', label: 'Happy Customers' },
    { value: '500+', label: 'Unique Designs' },
    { value: '4.8★', label: 'Avg Rating' },
    { value: '48hr', label: 'Dispatch' },
  ];

  readonly features: readonly Feature[] = [
    { icon: '🚚', title: 'Free Shipping', subtitle: 'Above ₹999 across India' },
    { icon: '💰', title: 'Cash on Delivery', subtitle: 'Pay when you receive' },
    { icon: '🔄', title: 'Easy Returns', subtitle: '7-day hassle-free' },
    { icon: '✨', title: 'Handcrafted', subtitle: 'Made with love in Pune' },
  ];

  readonly occasions: readonly Occasion[] = [
    {
      label: 'Bridal',
      emoji: '👰',
      description: 'Once-in-a-lifetime sparkle',
      tag: 'bridal',
      gradient: 'linear-gradient(135deg, #800020 0%, #A0334D 100%)',
    },
    {
      label: 'Festive',
      emoji: '🪔',
      description: 'Diwali, Ganpati & more',
      tag: 'festive',
      gradient: 'linear-gradient(135deg, #B8960F 0%, #D4AF37 100%)',
    },
    {
      label: 'Daily Wear',
      emoji: '🌸',
      description: 'Light, comfy, graceful',
      tag: 'daily',
      gradient: 'linear-gradient(135deg, #A0334D 0%, #800020 100%)',
    },
    {
      label: 'Gifting',
      emoji: '🎁',
      description: 'For the woman you love',
      tag: 'gift',
      gradient: 'linear-gradient(135deg, #D4AF37 0%, #800020 100%)',
    },
  ];

  readonly reasons: readonly Reason[] = [
    {
      icon: '✨',
      title: 'Lightweight Luxury',
      description:
        'Premium 1gm art jewellery — all the glow of gold, a fraction of the weight (and price).',
      tint: 'linear-gradient(135deg, #FFF8E7, #F5EDD6)',
    },
    {
      icon: '💛',
      title: 'Handcrafted in Pune',
      description:
        'Every piece is hand-finished by local artisans. No mass production, no compromises.',
      tint: 'linear-gradient(135deg, #FFE4E6, #FECACA)',
    },
    {
      icon: '🛡️',
      title: '6-Month Guarantee',
      description:
        'We stand behind every piece. Tarnish, bend, or break — we\'ll make it right.',
      tint: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
    },
    {
      icon: '🚀',
      title: 'Ships in 48 hours',
      description:
        'Ready stock. Orders leave Pune within 2 business days to any corner of India.',
      tint: 'linear-gradient(135deg, #E0E7FF, #C7D2FE)',
    },
    {
      icon: '💬',
      title: 'Real Human Support',
      description:
        'WhatsApp us any time. Styling advice, size help, or just a friendly chat — we\'re here.',
      tint: 'linear-gradient(135deg, #CFFAFE, #A5F3FC)',
    },
    {
      icon: '💎',
      title: 'Starts at ₹299',
      description:
        'Luxury jewellery shouldn\'t break the bank. Pieces for every budget, every occasion.',
      tint: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
    },
  ];

  readonly steps: readonly Step[] = [
    {
      number: 1,
      icon: '🛍️',
      title: 'Browse',
      description: 'Explore 500+ handcrafted designs across every occasion.',
    },
    {
      number: 2,
      icon: '💖',
      title: 'Choose',
      description: 'Add to cart. Save to wishlist. Take your sweet time.',
    },
    {
      number: 3,
      icon: '💳',
      title: 'Checkout',
      description: 'UPI, cards, or Cash on Delivery. Fast and secure.',
    },
    {
      number: 4,
      icon: '📦',
      title: 'Unbox Joy',
      description: 'Lovingly packaged and at your door in 2–5 days.',
    },
  ];

  readonly testimonials: readonly Testimonial[] = [
    {
      name: 'Priya S.',
      initials: 'PS',
      location: 'Mumbai, Maharashtra',
      quote:
        'Wore the Maharani necklace to my cousin\'s wedding — everyone asked where it was from! Genuinely premium quality for the price.',
      avatar: 'linear-gradient(135deg, #800020, #A0334D)',
    },
    {
      name: 'Anjali K.',
      initials: 'AK',
      location: 'Pune, Maharashtra',
      quote:
        'I order from स्त्रीरत्न every festival. The designs are unique, delivery is quick, and the team replies so sweetly on WhatsApp. My go-to.',
      avatar: 'linear-gradient(135deg, #D4AF37, #B8960F)',
    },
    {
      name: 'Rukmini D.',
      initials: 'RD',
      location: 'Nagpur, Maharashtra',
      quote:
        'Gifted the Nath to my daughter-in-law. She cried happy tears. Beautiful craftsmanship — feels truly Maharashtrian.',
      avatar: 'linear-gradient(135deg, #600018, #800020)',
    },
  ];

  readonly instagramTiles: readonly InstaTile[] = [
    { emoji: '💎', bg: 'linear-gradient(135deg, #800020, #A0334D)' },
    { emoji: '👑', bg: 'linear-gradient(135deg, #D4AF37, #B8960F)' },
    { emoji: '🌸', bg: 'linear-gradient(135deg, #A0334D, #600018)' },
    { emoji: '✨', bg: 'linear-gradient(135deg, #B8960F, #800020)' },
    { emoji: '🪔', bg: 'linear-gradient(135deg, #800020, #D4AF37)' },
    { emoji: '💖', bg: 'linear-gradient(135deg, #A0334D, #D4AF37)' },
  ];

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.simulateLiveViewers();
  }

  subscribe(event: Event): void {
    event.preventDefault();
    if (!this.email.trim()) return;
    this.subscribed.set(true);
    this.email = '';
  }

  private loadProducts(): void {
    this.productService
      .getFeaturedProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products) => {
          this.featuredProducts.set(products);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });

    this.productService
      .getBestSellers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((products) => this.bestSellers.set(products));
  }

  private loadCategories(): void {
    this.categoryService
      .getActiveCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((categories) => this.categories.set(categories));
  }

  private simulateLiveViewers(): void {
    const interval = setInterval(() => {
      this.liveViewers.set(this.randomBetween(42, 118));
    }, 6000);
    this.destroyRef.onDestroy(() => clearInterval(interval));
  }

  private randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
