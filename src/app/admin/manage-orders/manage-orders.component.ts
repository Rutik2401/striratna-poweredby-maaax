import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order.service';
import { Order, OrderStatus, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../core/models/order.model';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyInrPipe],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="font-heading text-xl font-bold text-gray-900">Orders</h2>
        <select [(ngModel)]="statusFilter" (ngModelChange)="filterOrders($event)"
          class="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/50">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <!-- Orders Table -->
      <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
        @if (filteredOrders().length === 0) {
          <div class="p-8 text-center text-gray-500 text-sm">No orders found</div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Items</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Payment</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                @for (order of filteredOrders(); track order.id) {
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4">
                      <p class="text-sm font-medium text-gray-900">{{ order.customerName }}</p>
                      <p class="text-xs text-gray-500">{{ order.customerPhone }}</p>
                      <p class="text-xs text-gray-400">{{ order.city }}</p>
                    </td>
                    <td class="px-6 py-4">
                      <div class="space-y-1">
                        @for (item of order.items; track item.productId) {
                          <p class="text-xs text-gray-600">{{ item.productName }} x{{ item.quantity }}</p>
                        }
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm font-semibold text-gray-900">{{ order.totalAmount | inr }}</td>
                    <td class="px-6 py-4">
                      <span class="text-xs font-medium capitalize text-gray-600">{{ order.paymentMethod }}</span>
                    </td>
                    <td class="px-6 py-4">
                      <span class="px-2.5 py-1 text-xs font-semibold rounded-full"
                            [class]="getStatusColor(order.status)">
                        {{ getStatusLabel(order.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <select
                        [ngModel]="order.status"
                        (ngModelChange)="updateStatus(order.id, $event)"
                        class="px-3 py-1.5 border border-gray-200 rounded-lg text-xs
                               focus:outline-none focus:ring-2 focus:ring-gold/50">
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
})
export class ManageOrdersComponent implements OnInit {
  private orderService = inject(OrderService);

  allOrders = signal<Order[]>([]);
  filteredOrders = signal<Order[]>([]);
  statusFilter = '';

  ngOnInit(): void {
    this.orderService.getOrders().subscribe((orders) => {
      this.allOrders.set(orders);
      this.filteredOrders.set(orders);
    });
  }

  filterOrders(status: string): void {
    if (status) {
      this.filteredOrders.set(this.allOrders().filter((o) => o.status === status));
    } else {
      this.filteredOrders.set(this.allOrders());
    }
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<void> {
    await this.orderService.updateOrderStatus(orderId, status);
  }

  getStatusLabel(status: OrderStatus): string {
    return ORDER_STATUS_LABELS[status];
  }

  getStatusColor(status: OrderStatus): string {
    return ORDER_STATUS_COLORS[status];
  }
}
