import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TopbarComponent, SidebarComponent } from '@nx-angular-express/shared-components';
import { AuthService } from './services/auth.service';

@Component({
  imports: [RouterModule, NgbModule, TopbarComponent, SidebarComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private authService = inject(AuthService);
  private router = inject(Router);

  protected title = 'Community Hub';

  protected navItems = [
    { label: 'Communities', route: '/communities', icon: 'bi bi-people' },
    { label: 'Profile', route: '/profile', icon: 'bi bi-person' },
  ];

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  onSignOut(): void {
    this.authService.removeToken();
    this.router.navigate(['/auth']);
  }
}
