import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunitiesApi, CreateCommunityRequest } from '../../services/communities.api';
import { CommunitiesListComponent } from '../../components/communities-list/communities-list.component';
import { CommunityFormComponent } from '../../components/community-form/community-form.component';
import { Community } from '@nx-angular-express/shared';
import { ToastService } from '@nx-angular-express/shared-components';
import { take } from 'rxjs';

@Component({
  selector: 'shared-communities-page',
  standalone: true,
  imports: [CommonModule, CommunitiesListComponent, CommunityFormComponent],
  templateUrl: './communities-page.component.html',
  styleUrls: ['./communities-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunitiesPageComponent {
  private api = inject(CommunitiesApi);
  private toast = inject(ToastService);

  readonly loading = signal(false);
  readonly communities = signal<Community[]>([]);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.api.list().pipe(take(1)).subscribe({
      next: (res) => {
        this.communities.set(res.data || []);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Failed to load communities', 'Please try again');
        this.loading.set(false);
      },
    });
  }

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

        const finish = (community: Community) => {
          const updated = [...this.communities(), community].filter(Boolean) as Community[];
          this.communities.set(updated);
          this.toast.success('Community created', 'Your community has been created');
          this.loading.set(false);
        };

        if (file) {
          this.api.uploadImage(created.id, file).pipe(take(1)).subscribe({
            next: (uploadRes) => {
              finish(uploadRes.data || created);
            },
            error: () => {
              this.toast.error('Community created but image upload failed', 'You can try uploading again.');
              finish(created);
            },
          });
        } else {
          finish(created);
        }
      },
      error: () => {
        this.toast.error('Failed to create community', 'Please try again');
        this.loading.set(false);
      },
    });
  }
}

