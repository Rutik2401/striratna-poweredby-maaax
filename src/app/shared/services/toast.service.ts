import { Injectable, signal } from '@angular/core';

export type ToastTone = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  readonly id: number;
  readonly tone: ToastTone;
  readonly title: string;
  readonly message?: string;
  readonly durationMs: number;
  readonly dismissible: boolean;
}

interface ToastInput {
  tone: ToastTone;
  title: string;
  message?: string;
  durationMs?: number;
  dismissible?: boolean;
}

const DEFAULT_DURATION: Record<ToastTone, number> = {
  success: 3000,
  info: 3500,
  warning: 4500,
  error: 5500,
};

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<readonly Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  private idCounter = 0;
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();

  show(input: ToastInput): number {
    const id = ++this.idCounter;
    const durationMs = input.durationMs ?? DEFAULT_DURATION[input.tone];
    const toast: Toast = {
      id,
      tone: input.tone,
      title: input.title,
      message: input.message,
      durationMs,
      dismissible: input.dismissible !== false,
    };

    this._toasts.update((list) => [...list, toast]);

    if (durationMs > 0) {
      const handle = setTimeout(() => this.dismiss(id), durationMs);
      this.timers.set(id, handle);
    }

    return id;
  }

  success(title: string, message?: string, durationMs?: number): number {
    return this.show({ tone: 'success', title, message, durationMs });
  }

  error(title: string, message?: string, durationMs?: number): number {
    return this.show({ tone: 'error', title, message, durationMs });
  }

  info(title: string, message?: string, durationMs?: number): number {
    return this.show({ tone: 'info', title, message, durationMs });
  }

  warning(title: string, message?: string, durationMs?: number): number {
    return this.show({ tone: 'warning', title, message, durationMs });
  }

  dismiss(id: number): void {
    this._toasts.update((list) => list.filter((t) => t.id !== id));
    const handle = this.timers.get(id);
    if (handle) {
      clearTimeout(handle);
      this.timers.delete(id);
    }
  }

  clear(): void {
    this._toasts.set([]);
    for (const handle of this.timers.values()) {
      clearTimeout(handle);
    }
    this.timers.clear();
  }
}
