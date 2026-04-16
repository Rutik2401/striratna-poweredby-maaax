import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderService } from '../../core/services/order.service';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { Order } from '../../core/models/order.model';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyInrPipe],
  template: `
    <div class="flex min-h-screen bg-gray-100">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-gray-200 fixed top-0 left-0 bottom-0 z-50 overflow-y-auto hidden md:block">
        <div class="py-6 px-4 text-center">
          <h2 class="text-2xl font-bold text-maroon">&#x0938;&#x094D;&#x0924;&#x094D;&#x0930;&#x0940;&#x0930;&#x0924;&#x094D;&#x0928;</h2>
          <span class="text-xs text-gray-400">Admin Panel</span>
        </div>
        <hr class="border-gray-200" />
        <nav class="mt-2">
          <a routerLink="/admin/dashboard" routerLinkActive="bg-maroon/10 text-maroon"
             class="flex items-center gap-3 px-5 py-3 text-gray-600 hover:bg-gray-50 transition">
            <span class="material-icons text-xl">dashboard</span>
            <span class="text-sm font-medium">Dashboard</span>
          </a>
          <a routerLink="/admin/orders" routerLinkActive="bg-maroon/10 text-maroon"
             class="flex items-center gap-3 px-5 py-3 text-gray-600 hover:bg-gray-50 transition">
            <span class="material-icons text-xl">receipt_long</span>
            <span class="text-sm font-medium">Orders</span>
          </a>
          <a routerLink="/admin/products" routerLinkActive="bg-maroon/10 text-maroon"
             class="flex items-center gap-3 px-5 py-3 text-gray-600 hover:bg-gray-50 transition">
            <span class="material-icons text-xl">inventory_2</span>
            <span class="text-sm font-medium">Products</span>
          </a>
          <a routerLink="/admin/categories" routerLinkActive="bg-maroon/10 text-maroon"
             class="flex items-center gap-3 px-5 py-3 text-gray-600 hover:bg-gray-50 transition">
            <span class="material-icons text-xl">category</span>
            <span class="text-sm font-medium">Categories</span>
          </a>
          <hr class="border-gray-200 my-2" />
          <a routerLink="/" class="flex items-center gap-3 px-5 py-3 text-gray-600 hover:bg-gray-50 transition">
            <span class="material-icons text-xl">storefront</span>
            <span class="text-sm font-medium">View Shop</span>
          </a>
          <button (click)="onLogout()"
                  class="flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 transition w-full text-left">
            <span class="material-icons text-xl">logout</span>
            <span class="text-sm font-medium">Logout</span>
          </button>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 md:ml-64 p-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

        <!-- Stat Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <!-- Orders Today -->
          <div class="bg-white rounded-xl shadow-sm border-l-4 border-maroon p-5 flex items-center gap-4">
            <span class="material-icons text-4xl text-maroon">shopping_bag</span>
            <div class="flex flex-col">
              <span class="text-2xl font-bold text-gray-800">{{ todayOrdersCount }}</span>
              <span class="text-xs text-gray-400 mt-0.5">Orders Today</span>
            </div>
          </div>
          <!-- Revenue -->
          <div class="bg-white rounded-xl shadow-sm border-l-4 border-green-600 p-5 flex items-center gap-4">
            <span class="material-icons text-4xl text-green-600">account_balance_wallet</span>
            <div class="flex flex-col">
              <span class="text-2xl font-bold text-gray-800">{{ todayRevenue | currencyInr }}</span>
              <span class="text-xs text-gray-400 mt-0.5">Revenue Today</span>
            </div>
          </div>
          <!-- Pending -->
          <div class="bg-white rounded-xl shadow-sm border-l-4 border-orange-600 p-5 flex items-center gap-4">
            <span class="material-icons text-4xl text-orange-600">pending_actions</span>
            <div class="flex flex-col">
              <span class="text-2xl font-bold text-gray-800 flex items-center gap-2">
                {{ pendingOrdersCount }}
                <span *ngIf="pendingOrdersCount > 0"
                      class="text-[10px] bg-orange-600 text-white px-2 py-0.5 rounded-full font-semibold uppercase">pending</span>
              </span>
              <span class="text-xs text-gray-400 mt-0.5">Pending Orders</span>
            </div>
          </div>
          <!-- Products -->
          <div class="bg-white rounded-xl shadow-sm border-l-4 border-blue-600 p-5 flex items-center gap-4">
            <span class="material-icons text-4xl text-blue-600">diamond</span>
            <div class="flex flex-col">
              <span class="text-2xl font-bold text-gray-800">{{ totalProducts }}</span>
              <span class="text-xs text-gray-400 mt-0.5">Total Products</span>
            </div>
          </div>
        </div>

        <!-- Recent Orders -->
        <div class="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-800">Recent Orders</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Order #</th>
                  <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr *ngFor="let order of recentOrders" class="hover:bg-gray-50 transition">
                  <td class="px-5 py-3 font-medium text-gray-800">{{ order.orderNumber }}</td>
                  <td class="px-5 py-3 text-gray-600">{{ order.customer.name }}</td>
                  <td class="px-5 py-3 text-gray-800 font-semibold">{{ order.totalAmount | currencyInr }}</td>
                  <td class="px-5 py-3">
                    <span class="px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
                          [ngClass]="{
                            'bg-orange-100 text-orange-700': order.status === 'pending',
                            'bg-blue-100 text-blue-700': order.status === 'packed',
                            'bg-purple-100 text-purple-700': order.status === 'dispatched',
                            'bg-green-100 text-green-700': order.status === 'delivered'
                          }">
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="px-5 py-3 text-gray-500">
                    {{ order.orderDate?.toDate ? (order.orderDate.toDate() | date:'dd MMM yyyy') : (order.orderDate | date:'dd MMM yyyy') }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div *ngIf="recentOrders.length === 0" class="py-10 text-center text-gray-400">
            No orders yet.
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="flex flex-wrap gap-3">
          <a routerLink="/admin/orders"
             class="inline-flex items-center gap-2 bg-maroon hover:bg-maroon-dark text-white px-5 py-2.5 rounded-lg font-medium transition">
            <span class="material-icons text-lg">receipt_long</span> Manage Orders
          </a>
          <a routerLink="/admin/products"
             class="inline-flex items-center gap-2 bg-maroon hover:bg-maroon-dark text-white px-5 py-2.5 rounded-lg font-medium transition">
            <span class="material-icons text-lg">add_box</span> Add Product
          </a>
          <a routerLink="/"
             class="inline-flex items-center gap-2 border border-maroon text-maroon hover:bg-maroon hover:text-white px-5 py-2.5 rounded-lg font-medium transition">
            <span class="material-icons text-lg">storefront</span> View Shop
          </a>
        </div>
      </main>
    </div>
  `,
  styles: [],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private router = inject(Router);

  todayOrdersCount = 0;
  todayRevenue = 0;
  pendingOrdersCount = 0;
  totalProducts = 0;
  recentOrders: Order[] = [];

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private loadDashboardData(): void {
    const ordersSub = this.orderService.getAll().subscribe(orders => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayOrders = orders.filter(o => {
        const orderDate = o.orderDate?.toDate ? o.orderDate.toDate() : new Date(o.orderDate);
        return orderDate >= today;
      });

      this.todayOrdersCount = todayOrders.length;
      this.todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      this.pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

      this.recentOrders = orders
        .sort((a, b) => {
          const dateA = a.orderDate?.toDate ? a.orderDate.toDate() : new Date(a.orderDate);
          const dateB = b.orderDate?.toDate ? b.orderDate.toDate() : new Date(b.orderDate);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 10);
    });
    this.subscriptions.push(ordersSub);

    const productsSub = this.productService.getAll().subscribe(products => {
      this.totalProducts = products.length;
    });
    this.subscriptions.push(productsSub);
  }

  async onLogout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
