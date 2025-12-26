import { Injectable, signal } from '@angular/core';
import { Community } from '@nx-angular-express/shared';

@Injectable({ providedIn: 'root' })
export class CommunityContextService {
  readonly activeCommunity = signal<Community | null>(null);

  setActive(community: Community): void {
    this.activeCommunity.set(community);
  }

  clear(): void {
    this.activeCommunity.set(null);
  }
}

