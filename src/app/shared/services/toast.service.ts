import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  timeout: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private id = 0;
  readonly toasts = signal<Toast[]>([]);

  private show(type: ToastType, message: string, timeout = 3000): void {
    const id = ++this.id;
    const toast: Toast = { id, type, message, timeout };
    this.toasts.update(list => [toast, ...list]);
    if (timeout > 0) {
      setTimeout(() => this.dismiss(id), timeout);
    }
  }

  dismiss(id: number): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  clear(): void {
    this.toasts.set([]);
  }

  success(message: string, timeout?: number): void {
    this.show('success', message, timeout);
  }
  error(message: string, timeout?: number): void {
    this.show('error', message, timeout ?? 5000);
  }
  info(message: string, timeout?: number): void {
    this.show('info', message, timeout);
  }
  warning(message: string, timeout?: number): void {
    this.show('warning', message, timeout);
  }
}
