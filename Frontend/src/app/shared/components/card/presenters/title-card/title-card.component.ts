import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-title-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './title-card.component.html',
  styleUrls: ['./title-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleCardComponent {
  @Input({ required: true }) imageUrl!: string;
  @Input({ required: true }) title!: string;
  @Input() logoUrl?: string;
  @Input() backdropSrcset: string = '';
}
