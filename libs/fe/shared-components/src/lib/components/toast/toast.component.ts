import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastConfig {
  title: string;
  body: string;
  type?: ToastType;
  dismissible?: boolean;
  autohide?: boolean;
  delay?: number;
}

@Component({
  selector: 'shared-toast',
  standalone: true,
  imports: [CommonModule, NgbToastModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) body!: string;
  @Input() type: ToastType = 'info';
  @Input() dismissible = true;
  @Input() autohide = true;
  @Input() delay = 5000;
  @Output() dismiss = new EventEmitter<void>();

  // Computed signal for Bootstrap toast classes
  toastClass = computed(() => {
    const baseClass = 'toast';
    const typeClass = `text-bg-${this.type}`;
    return `${baseClass} ${typeClass}`;
  });

  // Computed signal for header icon based on type
  iconClass = computed(() => {
    const iconMap: Record<ToastType, string> = {
      success: 'bi-check-circle-fill',
      error: 'bi-x-circle-fill',
      warning: 'bi-exclamation-triangle-fill',
      info: 'bi-info-circle-fill',
    };
    return iconMap[this.type];
  });

  onDismissClick(): void {
    this.dismiss.emit();
  }
}

