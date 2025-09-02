import { Component } from '@angular/core';
import { ListHeaderComponent } from './list-header/list-header.component';
import { MovieCardComponent } from '../../../../shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-movie-list',
  imports: [ListHeaderComponent, MovieCardComponent],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss',
})
export class MovieListComponent {}
