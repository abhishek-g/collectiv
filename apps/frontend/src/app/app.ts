import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastContainerComponent } from '@nx-angular-express/shared-components';

@Component({
  imports: [RouterModule, NgbModule, ToastContainerComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'frontend';
}
