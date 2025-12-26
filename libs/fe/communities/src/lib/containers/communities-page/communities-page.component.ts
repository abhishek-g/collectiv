import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CommunitiesApi } from '../../services/communities.api';
import { CommunitiesListComponent } from '../../components/communities-list/communities-list.component';
import { Community } from '@nx-angular-express/shared';
import { ToastService } from '@nx-angular-express/shared-components';
import { take } from 'rxjs';
import { CommunityContextService } from '../../services/community-context.service';

@Component({
  selector: 'shared-communities-page',
  standalone: true,
  imports: [CommonModule, RouterModule, CommunitiesListComponent],
  templateUrl: './communities-page.component.html',
  styleUrls: ['./communities-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunitiesPageComponent implements OnInit {
  private api = inject(CommunitiesApi);
  private toast = inject(ToastService);
  private context = inject(CommunityContextService);
  private router = inject(Router);

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
        this.context.clear();
      },
      error: () => {
        this.toast.error('Failed to load communities', 'Please try again');
        this.loading.set(false);
      },
    });
  }

  selectCommunity(community: Community): void {
    this.context.setActive(community);
    this.router.navigate(['/communities', community.id]);
  }
}

