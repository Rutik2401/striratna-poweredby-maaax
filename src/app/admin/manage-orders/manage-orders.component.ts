import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderService } from '../../core/services/order.service';
import { Order, OrderItem } from '../../core/models/order.model';
import { AuthService } from '../../core/services/auth.service';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CurrencyInrPipe],
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
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <h1 class="text-2xl font-bold text-gray-800">Manage Orders</h1>
          <button (click)="exportToCSV()"
                  class="inline-flex items-center gap-2 border border-maroon text-maroon hover:bg-maroon hover:text-white px-4 py-2 rounded-lg font-medium transition text-sm">
            <span class="material-icons text-lg">download</span> Export CSV
          </button>
        </div>

        <!-- Filters -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div class="flex flex-wrap gap-2">
            <button *ngFor="let tab of statusTabs"
                    (click)="filterByStatus(tab.value)"
                    class="px-4 py-2 rounded-lg text-sm font-medium border transition"
                    [ngClass]="activeTab === tab.value
                      ? 'bg-maroon text-white border-maroon'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'">
              {{ tab.label }}
              <span *ngIf="tab.value !== 'all'"
                    class="ml-1 text-xs bg-white/30 px-1.5 py-0.5 rounded-full">
                {{ getCountByStatus(tab.value) }}
              </span>
            </button>
          </div>
          <div class="relative w-full md:w-72">
            <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">search</span>
            <input type="text" placeholder="Search by name or phone..."
                   [(ngModel)]="searchQuery" (ngModelChange)="applyFilters()"
                   class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-maroon focus:border-maroon transition" />
          </div>
        </div>

        <!-- Orders Table -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Order #</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Items</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr *ngFor="let order of filteredOrders" class="hover:bg-gray-50 transition">
                  <td class="px-4 py-3 font-medium text-gray-800">{{ order.orderNumber }}</td>
                  <td class="px-4 py-3 text-gray-600">{{ order.customer.name }}</td>
                  <td class="px-4 py-3 text-gray-600">{{ order.customer.phone }}</td>
                  <td class="px-4 py-3 text-gray-600">{{ order.items.length }}</td>
                  <td class="px-4 py-3 text-gray-800 font-semibold">{{ order.totalAmount | currencyInr }}</td>
                  <td class="px-4 py-3 text-gray-500 text-xs">
                    {{ order.orderDate?.toDate ? (order.orderDate.toDate() | date:'dd MMM yy, h:mm a') : (order.orderDate | date:'dd MMM yy, h:mm a') }}
                  </td>
                  <td class="px-4 py-3">
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
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                      <select [ngModel]="order.status" (ngModelChange)="changeStatus(order, $event)"
                              class="text-xs border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-maroon bg-white">
                        <option value="pending">Pending</option>
                        <option value="packed">Packed</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="delivered">Delivered</option>
                      </select>
                      <button (click)="viewOrderDetails(order)" title="View Details"
                              class="text-gray-400 hover:text-maroon transition">
                        <span class="material-icons text-xl">visibility</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div *ngIf="filteredOrders.length === 0" class="py-10 text-center text-gray-400">
            No orders found.
          </div>
        </div>

        <!-- Order Detail Modal -->
        <div *ngIf="selectedOrder" class="fixed inset-0 bg-black/50 z-[1000] flex justify-center items-start pt-16 overflow-y-auto"
             (click)="selectedOrder = null">
          <div class="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[80vh] overflow-y-auto mx-4"
               (click)="$event.stopPropagation()">
            <!-- Header -->
            <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 class="text-lg font-bold text-maroon">Order #{{ selectedOrder.orderNumber }}</h2>
              <button (click)="selectedOrder = null" class="text-gray-400 hover:text-gray-600">
                <span class="material-icons">close</span>
              </button>
            </div>
            <!-- Body -->
            <div class="p-5 space-y-5">
              <!-- Customer -->
              <div>
                <h3 class="text-xs font-semibold text-maroon uppercase tracking-wider mb-2">Customer Details</h3>
                <p class="text-sm text-gray-700"><strong>Name:</strong> {{ selectedOrder.customer.name }}</p>
                <p class="text-sm text-gray-700"><strong>Phone:</strong> {{ selectedOrder.customer.phone }}</p>
                <p *ngIf="selectedOrder.customer.email" class="text-sm text-gray-700"><strong>Email:</strong> {{ selectedOrder.customer.email }}</p>
                <p class="text-sm text-gray-700"><strong>Address:</strong> {{ selectedOrder.customer.address }}, {{ selectedOrder.customer.city }}, {{ selectedOrder.customer.state }} - {{ selectedOrder.customer.pincode }}</p>
              </div>
              <hr class="border-gray-100" />
              <!-- Items -->
              <div>
                <h3 class="text-xs font-semibold text-maroon uppercase tracking-wider mb-2">Items</h3>
                <div *ngFor="let item of selectedOrder.items"
                     class="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <img [src]="item.image" [alt]="item.productName"
                       class="w-12 h-12 object-cover rounded-md border border-gray-200"
                       onerror="this.src='https://via.placeholder.com/50'" />
                  <div class="flex-1">
                    <p class="text-sm font-semibold text-gray-800">{{ item.productName }}</p>
                    <p class="text-xs text-gray-400">Qty: {{ item.quantity }} x {{ item.price | currencyInr }}</p>
                  </div>
                  <span class="text-sm font-bold text-gray-800">{{ item.price * item.quantity | currencyInr }}</span>
                </div>
              </div>
              <hr class="border-gray-100" />
              <!-- Totals -->
              <div class="space-y-1">
                <div class="flex justify-between text-sm text-gray-600">
                  <span>Subtotal:</span>
                  <strong>{{ selectedOrder.subtotal | currencyInr }}</strong>
                </div>
                <div class="flex justify-between text-sm text-gray-600">
                  <span>Delivery:</span>
                  <strong>{{ selectedOrder.deliveryCharge | currencyInr }}</strong>
                </div>
                <div class="flex justify-between text-base text-maroon font-bold border-t border-gray-200 pt-2 mt-2">
                  <span>Total:</span>
                  <strong>{{ selectedOrder.totalAmount | currencyInr }}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [],
})
export class ManageOrdersComponent implements OnInit, OnDestroy {
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private router = inject(Router);

  allOrders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedOrder: Order | null = null;
  searchQuery = '';
  activeTab = 'all';

  statusTabs = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Packed', value: 'packed' },
    { label: 'Dispatched', value: 'dispatched' },
    { label: 'Delivered', value: 'delivered' },
  ];

  private subscription?: Subscription;

  ngOnInit(): void {
    this.subscription = this.orderService.getAll().subscribe(orders => {
      this.allOrders = orders.sort((a, b) => {
        const dateA = a.orderDate?.toDate ? a.orderDate.toDate() : new Date(a.orderDate);
        const dateB = b.orderDate?.toDate ? b.orderDate.toDate() : new Date(b.orderDate);
        return dateB.getTime() - dateA.getTime();
      });
      this.applyFilters();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  filterByStatus(status: string): void {
    this.activeTab = status;
    this.applyFilters();
  }

  applyFilters(): void {
    let orders = [...this.allOrders];

    if (this.activeTab !== 'all') {
      orders = orders.filter(o => o.status === this.activeTab);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      orders = orders.filter(o =>
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.includes(q)
      );
    }

    this.filteredOrders = orders;
  }

  getCountByStatus(status: string): number {
    return this.allOrders.filter(o => o.status === status).length;
  }

  changeStatus(order: Order, newStatus: string): void {
    if (order.id) {
      this.orderService.updateStatus(order.id, newStatus as Order['status']);
    }
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
  }

  exportToCSV(): void {
    const headers = ['Order Number', 'Customer', 'Phone', 'Items', 'Total', 'Status', 'Date'];
    const rows = this.filteredOrders.map(o => [
      o.orderNumber,
      o.customer.name,
      o.customer.phone,
      o.items.length.toString(),
      o.totalAmount.toString(),
      o.status,
      o.orderDate?.toDate ? o.orderDate.toDate().toLocaleDateString() : new Date(o.orderDate).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `orders_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async onLogout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
