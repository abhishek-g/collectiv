import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunitiesApi, CreateCommunityRequest, UpdateCommunityRequest } from '../../services/communities.api';
import { CommunityFormComponent } from '../../components/community-form/community-form.component';
import { ToastService } from '@nx-angular-express/shared-components';
import { take } from 'rxjs';
import { Community } from '@nx-angular-express/shared';

@Component({
  selector: 'shared-edit-community-page',
  standalone: true,
  imports: [CommonModule, CommunityFormComponent],
  templateUrl: './edit-community-page.component.html',
  styleUrls: ['./edit-community-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCommunityPageComponent implements OnInit {
  private api = inject(CommunitiesApi);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly loading = signal(false);
  readonly community = signal<Community | null>(null);
  readonly communityId = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.toast.error('Invalid community ID', 'Please select a valid community');
      this.router.navigate(['/communities']);
      return;
    }
    this.communityId.set(id);
    this.loadCommunity();
  }

  loadCommunity(): void {
    const id = this.communityId();
    if (!id) return;

    this.loading.set(true);
    this.api.get(id).pipe(take(1)).subscribe({
      next: (res) => {
        if (res.data) {
          // Check if user has permission to edit
          if (!this.canEdit(res.data)) {
            this.toast.error('Access Denied', 'You do not have permission to edit this community');
            this.router.navigate(['/communities', id]);
            this.loading.set(false);
            return;
          }
          this.community.set(res.data);
        } else {
          this.toast.error('Community not found', 'It may have been deleted');
          this.router.navigate(['/communities']);
        }
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Failed to load community', 'Please try again');
        this.loading.set(false);
        this.router.navigate(['/communities']);
      },
    });
  }

  private canEdit(community: Community): boolean {
    const userId = this.getUserIdFromToken();
    if (!userId) return false;
    
    // Check if user is owner or admin
    if (community.ownerId === userId) return true;
    return community.members.some((m) => m.userId === userId && (m.role === 'admin' || m.role === 'owner'));
  }

  private getUserIdFromToken(): string | null {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    try {
      const payload = JSON.parse(atob(parts[1]));
      return payload?.userId ?? null;
    } catch {
      return null;
    }
  }

  updateCommunity(event: { body: CreateCommunityRequest | UpdateCommunityRequest; file?: File }): void {
    const id = this.communityId();
    if (!id) return;

    const { body, file } = event;
    // Convert to UpdateCommunityRequest (form always sends name, but API accepts optional)
    const updateBody: UpdateCommunityRequest = {
      name: body.name,
      description: body.description,
      visibility: body.visibility,
      imageUrl: body.imageUrl,
    };
    this.loading.set(true);
    this.api.update(id, updateBody).pipe(take(1)).subscribe({
      next: (res) => {
        const updated = res.data;
        if (!updated) {
          this.toast.error('Failed to update community', 'Please try again');
          this.loading.set(false);
          return;
        }

        const finish = (community: Community) => {
          this.community.set(community);
          this.toast.success('Community updated', 'Your changes have been saved');
          this.loading.set(false);
          this.router.navigate(['/communities', id]);
        };

        if (file) {
          this.api.uploadImage(id, file).pipe(take(1)).subscribe({
            next: (uploadRes) => {
              finish(uploadRes.data || updated);
            },
            error: () => {
              this.toast.warning('Community updated but image upload failed', 'You can try uploading again.');
              finish(updated);
            },
          });
        } else {
          finish(updated);
        }
      },
      error: () => {
        this.toast.error('Failed to update community', 'Please try again');
        this.loading.set(false);
      },
    });
  }

  cancel(): void {
    const id = this.communityId();
    if (id) {
      this.router.navigate(['/communities', id]);
    } else {
      this.router.navigate(['/communities']);
    }
  }
}

