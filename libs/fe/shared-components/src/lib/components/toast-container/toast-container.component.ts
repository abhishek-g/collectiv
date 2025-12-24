import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastComponent } from '../toast/toast.component';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'shared-toast-container',
  standalone: true,
  imports: [CommonModule, NgbToastModule, ToastComponent],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.scss',
})
export class ToastContainerComponent {
  protected readonly toastService = inject(ToastService);
  protected readonly toasts = this.toastService.toasts;

  onDismiss(id: string): void {
    this.toastService.remove(id);
  }
}

