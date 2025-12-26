import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommunityContextService } from '../../services/community-context.service';
import { ToastService } from '@nx-angular-express/shared-components';
import { Community } from '@nx-angular-express/shared';

@Component({
  selector: 'shared-community-detail-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './community-detail-page.component.html',
  styleUrls: ['./community-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunityDetailPageComponent {
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
}

