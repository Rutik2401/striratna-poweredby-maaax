import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
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
import { Product } from '../../core/models/product.model';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';

type NotificationTone = 'warn' | 'danger' | 'info' | 'success';

interface AdminNotification {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly routerLink: string[];
  readonly tone: NotificationTone;
  readonly icon: 'clock' | 'alert' | 'box' | 'sparkle';
  readonly timestamp: number;
}

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

const RECENT_ORDERS_LIMIT = 10;

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

  readonly products = signal<Product[]>([]);
  readonly ordersRaw = signal<Order[]>([]);
  readonly notificationsOpen = signal(false);
  readonly readNotificationIds = signal<ReadonlySet<string>>(new Set());

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
    {
      path: '/admin/dashboard/settings',
      label: 'Settings',
      icon: 'settings',
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
    if (url.endsWith('/settings')) {
      return {
        title: 'Settings',
        subtitle: 'Update brand profile — WhatsApp, email, delivery rates.',
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

  readonly notifications = computed<readonly AdminNotification[]>(() => {
    const items: AdminNotification[] = [];
    const orders = this.ordersRaw();
    const products = this.products();

    const pending = orders.filter((o) => o.status === 'pending');
    for (const order of pending.slice(0, 6)) {
      items.push({
        id: `pending-${order.id}`,
        title: `New order from ${order.customerName}`,
        body: `${order.items.length} item${order.items.length > 1 ? 's' : ''} · ${this.formatCompactInr(order.totalAmount)} — awaiting review`,
        routerLink: ['/admin/dashboard/orders'],
        tone: 'warn',
        icon: 'clock',
        timestamp: new Date(order.createdAt).getTime(),
      });
    }

    const failed = orders.filter((o) => o.paymentStatus === 'failed');
    for (const order of failed.slice(0, 4)) {
      items.push({
        id: `failed-${order.id}`,
        title: `Payment failed · ${order.customerName}`,
        body: order.paymentError ?? 'Customer payment did not complete — may need a manual follow-up.',
        routerLink: ['/admin/dashboard/orders'],
        tone: 'danger',
        icon: 'alert',
        timestamp: new Date(order.createdAt).getTime(),
      });
    }

    const outOfStock = products.filter((p) => !p.inStock);
    if (outOfStock.length > 0) {
      items.push({
        id: `stock-${outOfStock.length}`,
        title: `${outOfStock.length} product${outOfStock.length > 1 ? 's' : ''} out of stock`,
        body: outOfStock
          .slice(0, 3)
          .map((p) => p.name)
          .join(', ') + (outOfStock.length > 3 ? `, +${outOfStock.length - 3} more` : ''),
        routerLink: ['/admin/dashboard/products'],
        tone: 'info',
        icon: 'box',
        timestamp: Date.now(),
      });
    }

    const paidToday = orders.filter((o) => {
      if (o.paymentStatus !== 'paid' || !o.paidAt) return false;
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      return new Date(o.paidAt).getTime() >= startOfDay.getTime();
    });
    if (paidToday.length > 0) {
      const totalToday = paidToday.reduce((s, o) => s + o.totalAmount, 0);
      items.push({
        id: `paid-today-${paidToday.length}`,
        title: `${paidToday.length} payment${paidToday.length > 1 ? 's' : ''} received today`,
        body: `${this.formatCompactInr(totalToday)} collected · great momentum!`,
        routerLink: ['/admin/dashboard/orders'],
        tone: 'success',
        icon: 'sparkle',
        timestamp: Date.now(),
      });
    }

    return items.sort((a, b) => b.timestamp - a.timestamp);
  });

  readonly unreadCount = computed(() => {
    const read = this.readNotificationIds();
    return this.notifications().filter((n) => !read.has(n.id)).length;
  });

  readonly hasNotifications = computed(() => this.notifications().length > 0);

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((e) => {
        this.currentUrl.set((e as NavigationEnd).urlAfterRedirects);
        this.mobileMenuOpen.set(false);
        this.notificationsOpen.set(false);
      });

    this.orderService
      .getOrders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((orders) => {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

        this.ordersRaw.set(orders);
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
        this.products.set(products);
        this.totalProducts.set(products.length);
        this.lowStock.set(products.filter((p) => !p.inStock).length);
      });

    this.loadReadNotifications();
  }

  toggleNotifications(): void {
    this.notificationsOpen.update((v) => !v);
  }

  closeNotifications(): void {
    this.notificationsOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.notificationsOpen()) {
      this.notificationsOpen.set(false);
    } else if (this.mobileMenuOpen()) {
      this.mobileMenuOpen.set(false);
    }
  }

  markAllAsRead(): void {
    const ids = new Set(this.notifications().map((n) => n.id));
    this.readNotificationIds.set(ids);
    this.persistReadNotifications();
  }

  onNotificationClick(notification: AdminNotification): void {
    const next = new Set(this.readNotificationIds());
    next.add(notification.id);
    this.readNotificationIds.set(next);
    this.persistReadNotifications();
    this.router.navigate(notification.routerLink);
    this.closeNotifications();
  }

  private persistReadNotifications(): void {
    try {
      const ids = Array.from(this.readNotificationIds());
      localStorage.setItem('striratna_admin_read_notifications', JSON.stringify(ids));
    } catch {
      // localStorage might be disabled (private mode) — ignore
    }
  }

  private loadReadNotifications(): void {
    try {
      const raw = localStorage.getItem('striratna_admin_read_notifications');
      if (!raw) return;
      const ids: string[] = JSON.parse(raw);
      if (Array.isArray(ids)) {
        this.readNotificationIds.set(new Set(ids));
      }
    } catch {
      // ignore
    }
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
