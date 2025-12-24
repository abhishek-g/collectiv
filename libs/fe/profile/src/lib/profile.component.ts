import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpResponse, User } from '@nx-angular-express/shared';
import { ToastService } from '@nx-angular-express/shared-components';

@Component({
  selector: 'shared-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);

  readonly loading = signal<boolean>(true);
  readonly user = signal<User | null>(null);

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.loading.set(true);
    const token = localStorage.getItem('auth_token');
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;

    this.http
      .get<HttpResponse<User>>('/api/users/profile', { headers })
      .subscribe({
        next: (response) => {
          if (response?.success && response.data) {
            this.user.set(response.data);
          } else {
            this.toastService.warning(
              $localize`:@@profile.noDataTitle:Profile unavailable`,
              $localize`:@@profile.noDataMessage:We could not load your profile right now.`
            );
          }
          this.loading.set(false);
        },
        error: () => {
          // Global interceptor will toast the error; keep local state clean
          this.loading.set(false);
        },
      });
  }
}

