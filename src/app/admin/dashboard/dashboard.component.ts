import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { ProductService } from '../../core/services/product.service';
import { Order } from '../../core/models/order.model';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, CurrencyInrPipe],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Admin Navbar -->
      <nav class="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                <span class="text-white font-heading font-bold text-sm">स्त्री</span>
              </div>
              <span class="font-heading text-lg font-bold text-maroon">Admin Panel</span>
            </div>
            <div class="flex items-center gap-4">
              <a routerLink="/" class="text-sm text-gray-500 hover:text-maroon transition-colors">
                View Site
              </a>
              <button (click)="logout()"
                class="text-sm text-gray-500 hover:text-red-500 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Tab Navigation -->
        <div class="flex gap-1 bg-white rounded-xl p-1 shadow-sm mb-8 overflow-x-auto">
          @for (tab of tabs; track tab.path) {
            <a [routerLink]="tab.path" routerLinkActive="bg-maroon text-white shadow-sm"
               [routerLinkActiveOptions]="{ exact: tab.exact }"
               class="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600
                      hover:text-maroon transition-all whitespace-nowrap">
              {{ tab.label }}
            </a>
          }
        </div>

        <!-- Overview Stats (shown on main dashboard) -->
        @if (showOverview) {
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div class="bg-white rounded-2xl p-5 shadow-sm">
              <p class="text-sm text-gray-500">Total Orders</p>
              <p class="text-2xl font-bold text-maroon mt-1">{{ totalOrders() }}</p>
            </div>
            <div class="bg-white rounded-2xl p-5 shadow-sm">
              <p class="text-sm text-gray-500">Revenue</p>
              <p class="text-2xl font-bold text-green-600 mt-1">{{ totalRevenue() | inr }}</p>
            </div>
            <div class="bg-white rounded-2xl p-5 shadow-sm">
              <p class="text-sm text-gray-500">Products</p>
              <p class="text-2xl font-bold text-gold mt-1">{{ totalProducts() }}</p>
            </div>
            <div class="bg-white rounded-2xl p-5 shadow-sm">
              <p class="text-sm text-gray-500">Pending Orders</p>
              <p class="text-2xl font-bold text-orange-500 mt-1">{{ pendingOrders() }}</p>
            </div>
          </div>

          <!-- Recent Orders -->
          <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div class="p-6 border-b border-gray-100">
              <h3 class="font-heading text-lg font-semibold text-gray-900">Recent Orders</h3>
            </div>
            @if (recentOrders().length === 0) {
              <div class="p-8 text-center text-gray-500 text-sm">No orders yet</div>
            } @else {
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                      <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Items</th>
                      <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
                      <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    @for (order of recentOrders(); track order.id) {
                      <tr class="hover:bg-gray-50 transition-colors">
                        <td class="px-6 py-4">
                          <p class="text-sm font-medium text-gray-900">{{ order.customerName }}</p>
                          <p class="text-xs text-gray-500">{{ order.customerPhone }}</p>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-600">{{ order.items.length }} items</td>
                        <td class="px-6 py-4 text-sm font-semibold text-gray-900">{{ order.totalAmount | inr }}</td>
                        <td class="px-6 py-4">
                          <span class="px-2.5 py-1 text-xs font-semibold rounded-full capitalize
                                       bg-yellow-100 text-yellow-800">
                            {{ order.status }}
                          </span>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>
        }

        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private router = inject(Router);

  totalOrders = signal(0);
  totalRevenue = signal(0);
  totalProducts = signal(0);
  pendingOrders = signal(0);
  recentOrders = signal<Order[]>([]);

  showOverview = true;

  tabs = [
    { path: '/admin/dashboard', label: 'Overview', exact: true },
    { path: '/admin/dashboard/orders', label: 'Orders', exact: false },
    { path: '/admin/dashboard/products', label: 'Products', exact: false },
    { path: '/admin/dashboard/categories', label: 'Categories', exact: false },
  ];

  ngOnInit(): void {
    this.orderService.getOrders().subscribe((orders) => {
      this.totalOrders.set(orders.length);
      this.totalRevenue.set(orders.reduce((sum, o) => sum + o.totalAmount, 0));
      this.pendingOrders.set(orders.filter((o) => o.status === 'pending').length);
      this.recentOrders.set(orders.slice(0, 5));
    });

    this.productService.getProducts().subscribe((products) => {
      this.totalProducts.set(products.length);
    });
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
