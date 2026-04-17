import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Observable, from, map } from 'rxjs';
import {
  Order,
  OrderStatus,
  PaymentProvider,
  PaymentStatus,
} from '../models/order.model';

type NewOrder = Omit<
  Order,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'paymentStatus'
  | 'paymentProvider'
  | 'cashfreeOrderId'
  | 'paymentSessionId'
  | 'cashfreePaymentId'
  | 'paymentError'
  | 'paidAt'
>;

@Injectable({ providedIn: 'root' })
export class OrderService {
  private supabase = inject(SupabaseService).client;

  getOrders(): Observable<Order[]> {
    return from(
      this.supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data || []).map(this.mapOrder);
      })
    );
  }

  getOrderById(id: string): Observable<Order | undefined> {
    return from(
      this.supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) return undefined;
        return data ? this.mapOrder(data) : undefined;
      })
    );
  }

  getOrdersByStatus(status: OrderStatus): Observable<Order[]> {
    return from(
      this.supabase
        .from('orders')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data || []).map(this.mapOrder);
      })
    );
  }

  async createOrder(order: NewOrder): Promise<string> {
    const provider: PaymentProvider = order.paymentMethod;
    const initialPaymentStatus: PaymentStatus =
      provider === 'cashfree' ? 'pending' : 'pending';

    const { data, error } = await this.supabase
      .from('orders')
      .insert({
        items: order.items,
        total_amount: order.totalAmount,
        customer_name: order.customerName,
        customer_phone: order.customerPhone,
        customer_email: order.customerEmail,
        shipping_address: order.shippingAddress,
        city: order.city,
        pincode: order.pincode,
        status: order.status,
        payment_method: order.paymentMethod,
        payment_provider: provider,
        payment_status: initialPaymentStatus,
        notes: order.notes,
      })
      .select('id')
      .single();
    if (error) throw error;
    return data.id;
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
    const { error } = await this.supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }

  async getPaymentStatus(id: string): Promise<PaymentStatus | undefined> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('payment_status')
      .eq('id', id)
      .single();
    if (error || !data) return undefined;
    return data.payment_status as PaymentStatus;
  }

  private mapOrder(row: any): Order {
    return {
      id: row.id,
      items: row.items || [],
      totalAmount: row.total_amount,
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      customerEmail: row.customer_email,
      shippingAddress: row.shipping_address,
      city: row.city,
      pincode: row.pincode,
      status: row.status,
      paymentMethod: row.payment_method,
      paymentStatus: (row.payment_status ?? 'pending') as PaymentStatus,
      paymentProvider: (row.payment_provider ?? row.payment_method) as PaymentProvider,
      cashfreeOrderId: row.cashfree_order_id ?? undefined,
      paymentSessionId: row.payment_session_id ?? undefined,
      cashfreePaymentId: row.cashfree_payment_id ?? undefined,
      paymentError: row.payment_error ?? undefined,
      paidAt: row.paid_at ? new Date(row.paid_at) : undefined,
      notes: row.notes,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}
