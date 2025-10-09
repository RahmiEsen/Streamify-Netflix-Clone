import { Component, Input } from '@angular/core';
import { ActionButtonComponent } from '../../buttons/action-button/action-button.component';
import { Media } from '../../../../core/models/media.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-meta',
  imports: [CommonModule, ActionButtonComponent],
  templateUrl: './hero-meta.component.html',
  styleUrl: './hero-meta.component.scss',
})
export class HeroMetaComponent {
  @Input() movie: Media | null = null;
}
