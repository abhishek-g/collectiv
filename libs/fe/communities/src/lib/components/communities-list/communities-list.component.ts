import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Community } from '@nx-angular-express/shared';

@Component({
  selector: 'shared-communities-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './communities-list.component.html',
  styleUrls: ['./communities-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunitiesListComponent {
  @Input() communities: Community[] = [];
  @Output() select = new EventEmitter<Community>();
}

