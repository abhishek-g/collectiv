import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommunityContextService } from '../../services/community-context.service';
import { ToastService } from '@nx-angular-express/shared-components';
import { Community } from '@nx-angular-express/shared';

// Helper function to decode JWT token
function getUserIdFromToken(): string | null {
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

@Component({
  selector: 'shared-community-detail-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './community-detail-page.component.html',
  styleUrls: ['./community-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunityDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private context = inject(CommunityContextService);
  private toast = inject(ToastService);

  readonly loading = signal(false);
  readonly community = this.context.activeCommunity;

  ngOnInit(): void {
    const data = this.route.snapshot.data as { community?: Community | null };
    if (data?.community) {
      this.context.setActive(data.community);
    } else {
      this.toast.error('Community not found', 'It may have been deleted');
    }
    this.loading.set(false);
  }

  canEdit(): boolean {
    const comm = this.community();
    const userId = getUserIdFromToken();
    if (!comm || !userId) return false;
    
    // Check if user is owner or admin
    if (comm.ownerId === userId) return true;
    return comm.members.some((m) => m.userId === userId && (m.role === 'admin' || m.role === 'owner'));
  }
}

