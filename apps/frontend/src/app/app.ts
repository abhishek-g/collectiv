import { Component, inject } from '@angular/core';
import { Router, RouterModule, NavigationEnd, ActivatedRoute } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TopbarComponent, SidebarComponent } from '@nx-angular-express/shared-components';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  imports: [RouterModule, NgbModule, TopbarComponent, SidebarComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected title = 'Community Hub';
  protected communityName?: string;
  private currentCommunityId: string | null = null;

  constructor() {
    this.handleRoute(this.router.url);
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe((e) => {
      this.handleRoute(e.urlAfterRedirects || e.url);
    });
  }

  protected get navItems() {
    if (this.currentCommunityId) {
      const id = this.currentCommunityId;
      return [
        { label: 'Overview', route: `/communities/${id}`, icon: 'bi bi-house' },
        { label: 'Members', route: `/communities/${id}/members`, icon: 'bi bi-people' },
        { label: 'Tournaments', route: `/communities/${id}/tournaments`, icon: 'bi bi-trophy' },
        { label: 'Chat', route: `/communities/${id}/chat`, icon: 'bi bi-chat-dots' },
      ];
    }
    return [
      { label: 'Communities', route: '/communities', icon: 'fi-rr-users' },
      { label: 'Profile', route: '/profile', icon: 'bi bi-person' },
    ];
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  onSignOut(): void {
    this.authService.removeToken();
    this.router.navigate(['/auth']);
  }

  private handleRoute(url: string): void {
    // Traverse activated route tree to get params and resolved data
    let route: ActivatedRoute | null = this.route.firstChild;
    let id: string | null = null;
    let name: string | undefined = undefined;

    while (route) {
      if (route.snapshot.paramMap.has('id')) {
        id = route.snapshot.paramMap.get('id');
      }
      if (route.snapshot.data && (route.snapshot.data as any).community) {
        name = (route.snapshot.data as any).community?.name;
      }
      route = route.firstChild;
    }

    this.currentCommunityId = id;
    this.communityName = name;
  }
}
