import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { OrderService } from './order.service';
import { environment } from '../../environments/environment';
import { PaymentStatus } from '../models/order.model';

declare global {
  interface Window {
    Cashfree?: (config: { mode: 'sandbox' | 'production' }) => CashfreeInstance;
  }
}

interface CashfreeInstance {
  checkout(options: {
    paymentSessionId: string;
    redirectTarget?: '_self' | '_blank' | '_modal';
  }): Promise<CashfreeCheckoutResult>;
}

interface CashfreeCheckoutResult {
  error?: { message?: string; code?: string };
  redirect?: boolean;
  paymentDetails?: { paymentMessage?: string };
}

export interface PayOnlineInput {
  orderId: string;
  amount: number;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
}

export interface PayOnlineResult {
  status: PaymentStatus;
  error?: string;
}

const CASHFREE_SDK_URL = 'https://sdk.cashfree.com/js/v3/cashfree.js';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly supabase = inject(SupabaseService).client;
  private readonly orderService = inject(OrderService);

  private sdkPromise?: Promise<void>;

  async payOnline(input: PayOnlineInput): Promise<PayOnlineResult> {
    const { paymentSessionId } = await this.createCashfreeOrder(input);
    await this.loadCashfreeSdk();
    const cashfree = window.Cashfree?.({ mode: environment.cashfree.mode });
    if (!cashfree) {
      return { status: 'failed', error: 'Unable to initialise Cashfree' };
    }

    const result = await cashfree.checkout({
      paymentSessionId,
      redirectTarget: '_modal',
    });

    if (result?.error) {
      return {
        status: 'failed',
        error: result.error.message ?? 'Payment cancelled',
      };
    }

    // Webhook is authoritative — poll the order row until status is final
    return this.pollPaymentStatus(input.orderId);
  }

  private async createCashfreeOrder(input: PayOnlineInput): Promise<{
    paymentSessionId: string;
    cashfreeOrderId: string;
  }> {
    const { data, error } = await this.supabase.functions.invoke(
      environment.cashfree.createOrderFunction,
      {
        body: {
          orderId: input.orderId,
          amount: input.amount,
          customer: input.customer,
        },
      }
    );

    if (error) {
      throw new Error(
        `Unable to start payment: ${error.message ?? 'network error'}`
      );
    }

    const payload = data as {
      paymentSessionId?: string;
      cashfreeOrderId?: string;
      error?: string;
    };

    if (!payload?.paymentSessionId || !payload?.cashfreeOrderId) {
      throw new Error(payload?.error ?? 'Unable to start payment');
    }

    return {
      paymentSessionId: payload.paymentSessionId,
      cashfreeOrderId: payload.cashfreeOrderId,
    };
  }

  private loadCashfreeSdk(): Promise<void> {
    if (window.Cashfree) return Promise.resolve();
    if (this.sdkPromise) return this.sdkPromise;

    this.sdkPromise = new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${CASHFREE_SDK_URL}"]`
      );
      if (existing) {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () =>
          reject(new Error('Cashfree SDK failed to load'))
        );
        return;
      }

      const script = document.createElement('script');
      script.src = CASHFREE_SDK_URL;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        this.sdkPromise = undefined;
        reject(new Error('Cashfree SDK failed to load'));
      };
      document.head.appendChild(script);
    });

    return this.sdkPromise;
  }

  private async pollPaymentStatus(
    orderId: string,
    attempts = 20,
    intervalMs = 1500
  ): Promise<PayOnlineResult> {
    for (let i = 0; i < attempts; i++) {
      const status = await this.orderService.getPaymentStatus(orderId);
      if (status === 'paid') return { status: 'paid' };
      if (status === 'failed') {
        return { status: 'failed', error: 'Payment was not successful' };
      }
      await delay(intervalMs);
    }
    return { status: 'pending' };
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
