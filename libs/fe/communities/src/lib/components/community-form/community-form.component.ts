import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateCommunityRequest, UpdateCommunityRequest } from '../../services/communities.api';

@Component({
  selector: 'shared-community-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './community-form.component.html',
  styleUrls: ['./community-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunityFormComponent implements OnChanges {
  @Input() initial: Partial<CreateCommunityRequest & { imageUrl?: string }> = {};
  @Output() save = new EventEmitter<{
    body: CreateCommunityRequest | UpdateCommunityRequest;
    file?: File;
  }>();

  model: CreateCommunityRequest & { imageUrl?: string } = {
    name: '',
    description: '',
    visibility: 'public',
    imageUrl: undefined,
  };
  selectedFile?: File;

  ngOnChanges(_changes: SimpleChanges): void {
    this.model = {
      name: this.initial.name ?? '',
      description: this.initial.description ?? '',
      visibility: (this.initial.visibility as 'public' | 'private' | undefined) || 'public',
      imageUrl: this.initial.imageUrl,
    };
  }

  onSubmit(): void {
    this.save.emit({
      body: {
        name: this.model.name,
        description: this.model.description || undefined,
        visibility: this.model.visibility,
        imageUrl: this.model.imageUrl,
      },
      file: this.selectedFile,
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.selectedFile = file || undefined;
  }
}

