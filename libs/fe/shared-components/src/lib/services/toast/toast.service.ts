import { Injectable, signal, computed } from '@angular/core';
import { ToastConfig, ToastType } from '../../components/toast/toast.component';

export interface Toast extends ToastConfig {
  id: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private _toasts = signal<Toast[]>([]);
  
  // Public readonly signal for toasts
  readonly toasts = this._toasts.asReadonly();
  
  // Computed signal for toast count
  readonly toastCount = computed(() => this._toasts().length);

  /**
   * Show a toast notification
   */
  show(config: ToastConfig): string {
    const toast: Toast = {
      ...config,
      id: this.generateId(),
      timestamp: Date.now(),
      type: config.type ?? 'info',
      dismissible: config.dismissible ?? true,
      autohide: config.autohide ?? true,
      delay: config.delay ?? 5000,
    };

    this._toasts.update((toasts) => [...toasts, toast]);

    // Auto-remove toast after delay if autohide is enabled
    if (toast.autohide) {
      setTimeout(() => {
        this.remove(toast.id);
      }, toast.delay);
    }

    return toast.id;
  }

  /**
   * Show a success toast
   */
  success(title: string, body: string, config?: Partial<ToastConfig>): string {
    return this.show({
      title,
      body,
      type: 'success',
      ...config,
    });
  }

  /**
   * Show an error toast
   */
  error(title: string, body: string, config?: Partial<ToastConfig>): string {
    return this.show({
      title,
      body,
      type: 'error',
      ...config,
    });
  }

  /**
   * Show a warning toast
   */
  warning(title: string, body: string, config?: Partial<ToastConfig>): string {
    return this.show({
      title,
      body,
      type: 'warning',
      ...config,
    });
  }

  /**
   * Show an info toast
   */
  info(title: string, body: string, config?: Partial<ToastConfig>): string {
    return this.show({
      title,
      body,
      type: 'info',
      ...config,
    });
  }

  /**
   * Remove a toast by ID
   */
  remove(id: string): void {
    this._toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }

  /**
   * Clear all toasts
   */
  clear(): void {
    this._toasts.set([]);
  }

  /**
   * Generate a unique ID for a toast
   */
  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

