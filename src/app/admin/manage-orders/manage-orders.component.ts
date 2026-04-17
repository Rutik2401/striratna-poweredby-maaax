import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { OrderService } from '../../core/services/order.service';
import {
  Order,
  OrderStatus,
  PaymentStatus,
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
  PAYMENT_STATUS_LABELS,
} from '../../core/models/order.model';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';

type SortKey = 'newest' | 'oldest' | 'amount-high' | 'amount-low';

interface StatusOption {
  readonly value: OrderStatus | 'all';
  readonly label: string;
}

interface PaymentStatusOption {
  readonly value: PaymentStatus | 'all';
  readonly label: string;
}

interface SortOption {
  readonly value: SortKey;
  readonly label: string;
}

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, CurrencyInrPipe],
  templateUrl: './manage-orders.component.html',
  styleUrl: './manage-orders.component.scss',
})
export class ManageOrdersComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly destroyRef = inject(DestroyRef);

  readonly allOrders = signal<Order[]>([]);
  readonly loading = signal(true);
  readonly toast = signal<{ message: string; tone: 'success' | 'error' } | null>(null);
  readonly expandedOrderId = signal<string | null>(null);

  // Filters
  readonly searchQuery = signal('');
  readonly statusFilter = signal<OrderStatus | 'all'>('all');
  readonly paymentStatusFilter = signal<PaymentStatus | 'all'>('all');
  readonly sortKey = signal<SortKey>('newest');

  readonly statusLabels = ORDER_STATUS_LABELS;
  readonly statusColors = ORDER_STATUS_COLORS;
  readonly paymentStatusLabels = PAYMENT_STATUS_LABELS;
  readonly paymentStatusColors = PAYMENT_STATUS_COLORS;

  readonly statusOptions: readonly StatusOption[] = [
    { value: 'all', label: 'All statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  readonly paymentStatusOptions: readonly PaymentStatusOption[] = [
    { value: 'all', label: 'All payments' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' },
  ];

  readonly sortOptions: readonly SortOption[] = [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'amount-high', label: 'Amount: high to low' },
    { value: 'amount-low', label: 'Amount: low to high' },
  ];

  // Stats
  readonly totalCount = computed(() => this.allOrders().length);
  readonly pendingCount = computed(
    () => this.allOrders().filter((o) => o.status === 'pending').length
  );
  readonly paidCount = computed(
    () => this.allOrders().filter((o) => o.paymentStatus === 'paid').length
  );
  readonly revenueTotal = computed(() =>
    this.allOrders()
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.totalAmount, 0)
  );

  readonly statusCounts = computed(() => {
    const counts: Record<OrderStatus | 'all', number> = {
      all: this.allOrders().length,
      pending: 0,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    for (const order of this.allOrders()) {
      counts[order.status]++;
    }
    return counts;
  });

  readonly filteredOrders = computed<readonly Order[]>(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const status = this.statusFilter();
    const payStatus = this.paymentStatusFilter();
    const sort = this.sortKey();

    let list = [...this.allOrders()];

    if (status !== 'all') list = list.filter((o) => o.status === status);
    if (payStatus !== 'all') list = list.filter((o) => o.paymentStatus === payStatus);

    if (query) {
      list = list.filter((o) => {
        const haystack = [
          o.customerName,
          o.customerPhone,
          o.customerEmail ?? '',
          o.city,
          o.pincode,
          o.id,
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(query);
      });
    }

    list.sort((a, b) => {
      if (sort === 'oldest')
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sort === 'amount-high') return b.totalAmount - a.totalAmount;
      if (sort === 'amount-low') return a.totalAmount - b.totalAmount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return list;
  });

  readonly hasActiveFilters = computed(
    () =>
      !!this.searchQuery().trim() ||
      this.statusFilter() !== 'all' ||
      this.paymentStatusFilter() !== 'all' ||
      this.sortKey() !== 'newest'
  );

  readonly filteredCount = computed(() => this.filteredOrders().length);

  constructor() {
    effect(() => {
      const current = this.toast();
      if (!current) return;
      const handle = setTimeout(() => this.toast.set(null), 2800);
      this.destroyRef.onDestroy(() => clearTimeout(handle));
    });
  }

  ngOnInit(): void {
    this.orderService
      .getOrders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (orders) => {
          this.allOrders.set(orders);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  onSearchInput(value: string): void {
    this.searchQuery.set(value);
  }

  setStatus(value: OrderStatus | 'all'): void {
    this.statusFilter.set(value);
  }

  setPaymentStatus(value: PaymentStatus | 'all'): void {
    this.paymentStatusFilter.set(value);
  }

  setSort(value: SortKey): void {
    this.sortKey.set(value);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.statusFilter.set('all');
    this.paymentStatusFilter.set('all');
    this.sortKey.set('newest');
  }

  toggleExpand(orderId: string): void {
    this.expandedOrderId.update((id) => (id === orderId ? null : orderId));
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<void> {
    try {
      await this.orderService.updateOrderStatus(orderId, status);
      await this.refresh();
      this.showToast(`Marked as ${ORDER_STATUS_LABELS[status]}`, 'success');
    } catch {
      this.showToast('Could not update order status', 'error');
    }
  }

  private async refresh(): Promise<void> {
    const data = await new Promise<Order[]>((resolve, reject) => {
      this.orderService.getOrders().subscribe({ next: resolve, error: reject });
    });
    this.allOrders.set(data);
  }

  private showToast(message: string, tone: 'success' | 'error'): void {
    this.toast.set({ message, tone });
  }
}
