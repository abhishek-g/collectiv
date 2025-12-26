import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CommunitiesApi, CreateCommunityRequest } from '../../services/communities.api';
import { CommunityFormComponent } from '../../components/community-form/community-form.component';
import { ToastService } from '@nx-angular-express/shared-components';
import { take } from 'rxjs';

@Component({
  selector: 'shared-create-community-page',
  standalone: true,
  imports: [CommonModule, CommunityFormComponent],
  templateUrl: './create-community-page.component.html',
  styleUrls: ['./create-community-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCommunityPageComponent {
  private api = inject(CommunitiesApi);
  private toast = inject(ToastService);
  private router = inject(Router);

  readonly loading = signal(false);

  createCommunity(event: { body: CreateCommunityRequest; file?: File }): void {
    const { body, file } = event;
    this.loading.set(true);
    this.api.create(body).pipe(take(1)).subscribe({
      next: (res) => {
        const created = res.data;
        if (!created) {
          this.toast.error('Failed to create community', 'Please try again');
          this.loading.set(false);
          return;
        }

        const finish = (communityId: string) => {
          this.toast.success('Community created', 'Your community has been created successfully');
          this.loading.set(false);
          this.router.navigate(['/communities', communityId]);
        };

        if (file) {
          this.api.uploadImage(created.id, file).pipe(take(1)).subscribe({
            next: () => {
              finish(created.id);
            },
            error: () => {
              this.toast.warning('Community created but image upload failed', 'You can upload an image later.');
              finish(created.id);
            },
          });
        } else {
          finish(created.id);
        }
      },
      error: () => {
        this.toast.error('Failed to create community', 'Please try again');
        this.loading.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/communities']);
  }
}

