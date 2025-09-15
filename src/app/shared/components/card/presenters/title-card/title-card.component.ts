import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../../../core/models/movie.model';

@Component({
  selector: 'app-title-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './title-card.component.html',
  styleUrls: ['./title-card.component.scss'],
})
export class TitleCardComponent {
  @Input({ required: true }) movie!: Movie;
}
