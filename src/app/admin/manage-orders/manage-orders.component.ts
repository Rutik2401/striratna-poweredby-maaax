import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrderService } from '../../core/services/order.service';
import {
  Order,
  OrderStatus,
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
} from '../../core/models/order.model';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';

interface StatusOption {
  readonly value: OrderStatus;
  readonly label: string;
}

const STATUS_OPTIONS: readonly StatusOption[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, CurrencyInrPipe],
  templateUrl: './manage-orders.component.html',
})
export class ManageOrdersComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly destroyRef = inject(DestroyRef);

  readonly allOrders = signal<Order[]>([]);
  readonly statusFilterSignal = signal<OrderStatus | ''>('');

  readonly filteredOrders = computed(() => {
    const status = this.statusFilterSignal();
    const orders = this.allOrders();
    return status ? orders.filter((o) => o.status === status) : orders;
  });

  statusFilter: OrderStatus | '' = '';

  readonly statusLabels = ORDER_STATUS_LABELS;
  readonly statusColors = ORDER_STATUS_COLORS;
  readonly statusOptions = STATUS_OPTIONS;

  ngOnInit(): void {
    this.orderService
      .getOrders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((orders) => this.allOrders.set(orders));
  }

  onFilterChange(status: OrderStatus | ''): void {
    this.statusFilterSignal.set(status);
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<void> {
    await this.orderService.updateOrderStatus(orderId, status);
  }
}
