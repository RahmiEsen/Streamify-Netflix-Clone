import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankedItem } from '../../../../../features/browse/browse.component';

@Component({
  selector: 'app-ranked-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ranked-card.component.html',
  styleUrl: './ranked-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankedCardComponent {
  @Input({ required: true }) item!: RankedItem;
  /* @Input({ required: true }) imageBaseUrl!: string; */
}
