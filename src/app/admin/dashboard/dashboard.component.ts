import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { ProductService } from '../../core/services/product.service';
import { Order } from '../../core/models/order.model';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';

interface AdminTab {
  readonly path: string;
  readonly label: string;
  readonly exact: boolean;
}

const RECENT_ORDERS_LIMIT = 5;

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, CurrencyInrPipe],
  templateUrl: './dashboard.component.html',
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
  readonly recentOrders = signal<Order[]>([]);

  readonly showOverview = true;

  readonly tabs: readonly AdminTab[] = [
    { path: '/admin/dashboard', label: 'Overview', exact: true },
    { path: '/admin/dashboard/orders', label: 'Orders', exact: false },
    { path: '/admin/dashboard/products', label: 'Products', exact: false },
    { path: '/admin/dashboard/categories', label: 'Categories', exact: false },
  ];

  ngOnInit(): void {
    this.orderService
      .getOrders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((orders) => {
        this.totalOrders.set(orders.length);
        this.totalRevenue.set(orders.reduce((sum, o) => sum + o.totalAmount, 0));
        this.pendingOrders.set(orders.filter((o) => o.status === 'pending').length);
        this.recentOrders.set(orders.slice(0, RECENT_ORDERS_LIMIT));
      });

    this.productService
      .getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((products) => this.totalProducts.set(products.length));
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
