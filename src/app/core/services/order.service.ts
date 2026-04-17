import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Observable, from, map } from 'rxjs';
import { Order, OrderStatus } from '../models/order.model';

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

  async createOrder(order: Omit<Order, 'id'>): Promise<string> {
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
      notes: row.notes,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}
