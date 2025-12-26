import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TopbarComponent, SidebarComponent } from '@nx-angular-express/shared-components';

@Component({
  imports: [RouterModule, NgbModule, TopbarComponent, SidebarComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'Community Hub';

  protected navItems = [
    { label: 'Profile', route: '/profile', icon: 'bi bi-person' },
    { label: 'Communities', route: '/communities', icon: 'bi bi-people' },
  ];
}
