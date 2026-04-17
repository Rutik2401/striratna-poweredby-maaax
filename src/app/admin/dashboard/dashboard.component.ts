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
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  NavigationEnd,
} from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { ProductService } from '../../core/services/product.service';
import { Order } from '../../core/models/order.model';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';

interface NavItem {
  readonly path: string;
  readonly label: string;
  readonly icon: string;
  readonly exact: boolean;
  readonly countKey?: 'orders' | 'pending' | 'products';
}

interface ResolvedNavItem extends NavItem {
  readonly count: number | null;
}

interface PageMeta {
  readonly title: string;
  readonly subtitle: string;
}

const RECENT_ORDERS_LIMIT = 6;

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    CurrencyInrPipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly totalOrders = signal(0);
  readonly totalRevenue = signal(0);
  readonly totalProducts = signal(0);
  readonly pendingOrders = signal(0);
  readonly paidOrders = signal(0);
  readonly todayOrders = signal(0);
  readonly todayRevenue = signal(0);
  readonly lowStock = signal(0);
  readonly recentOrders = signal<Order[]>([]);

  readonly sidebarOpen = signal(true);
  readonly mobileMenuOpen = signal(false);
  readonly currentUrl = signal<string>(this.router.url);

  readonly navItems: readonly NavItem[] = [
    { path: '/admin/dashboard', label: 'Overview', icon: 'grid', exact: true },
    {
      path: '/admin/dashboard/orders',
      label: 'Orders',
      icon: 'orders',
      exact: false,
      countKey: 'pending',
    },
    {
      path: '/admin/dashboard/products',
      label: 'Products',
      icon: 'box',
      exact: false,
      countKey: 'products',
    },
    {
      path: '/admin/dashboard/categories',
      label: 'Categories',
      icon: 'tag',
      exact: false,
    },
  ];

  readonly pageMeta = computed<PageMeta>(() => {
    const url = this.currentUrl();
    if (url.endsWith('/orders')) {
      return {
        title: 'Orders',
        subtitle: 'Review, filter, and fulfil every customer order.',
      };
    }
    if (url.endsWith('/products')) {
      return {
        title: 'Products',
        subtitle: 'Curate your catalogue — tags, stock, and imagery.',
      };
    }
    if (url.endsWith('/categories')) {
      return {
        title: 'Categories',
        subtitle: 'Organise how customers discover your collection.',
      };
    }
    return {
      title: 'Overview',
      subtitle: 'Your store at a glance.',
    };
  });

  readonly isOverview = computed(() => this.currentUrl() === '/admin/dashboard');

  readonly resolvedNavItems = computed<readonly ResolvedNavItem[]>(() =>
    this.navItems.map((item) => ({
      ...item,
      count: this.resolveCount(item.countKey),
    }))
  );

  readonly currencyPreview = computed(() => this.formatCompactInr(this.todayRevenue()));
  readonly revenueCompact = computed(() => this.formatCompactInr(this.totalRevenue()));

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((e) => {
        this.currentUrl.set((e as NavigationEnd).urlAfterRedirects);
        this.mobileMenuOpen.set(false);
      });

    this.orderService
      .getOrders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((orders) => {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

        this.totalOrders.set(orders.length);
        this.totalRevenue.set(orders.reduce((s, o) => s + o.totalAmount, 0));
        this.pendingOrders.set(orders.filter((o) => o.status === 'pending').length);
        this.paidOrders.set(orders.filter((o) => o.paymentStatus === 'paid').length);

        const todays = orders.filter(
          (o) => new Date(o.createdAt).getTime() >= startOfDay
        );
        this.todayOrders.set(todays.length);
        this.todayRevenue.set(todays.reduce((s, o) => s + o.totalAmount, 0));

        this.recentOrders.set(orders.slice(0, RECENT_ORDERS_LIMIT));
      });

    this.productService
      .getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((products) => {
        this.totalProducts.set(products.length);
        this.lowStock.set(products.filter((p) => !p.inStock).length);
      });
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  private resolveCount(key: NavItem['countKey']): number | null {
    switch (key) {
      case 'pending':
        return this.pendingOrders();
      case 'products':
        return this.totalProducts();
      case 'orders':
        return this.totalOrders();
      default:
        return null;
    }
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/admin/login']);
  }

  private formatCompactInr(value: number): string {
    if (value >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(1)}Cr`;
    if (value >= 1_00_000) return `₹${(value / 1_00_000).toFixed(1)}L`;
    if (value >= 1_000) return `₹${(value / 1_000).toFixed(1)}k`;
    return `₹${value.toLocaleString('en-IN')}`;
  }
}
