import { Component, Input } from '@angular/core';
import { Movie } from '../../../../../core/models/movie.model';
import { CommonModule } from '@angular/common';
import { RankedItem } from '../../../../../features/browse/pages/browse/browse.component';

@Component({
  selector: 'app-ranked-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ranked-card.component.html',
  styleUrl: './ranked-card.component.scss',
})
export class RankedCardComponent {
  @Input() rank: number = 1;
  @Input({ required: true }) item!: RankedItem;
  /* getRankImageUrl(): string {
    return `assets/images/ranking/ranked-${this.rank}.svg`;
  } */
}
