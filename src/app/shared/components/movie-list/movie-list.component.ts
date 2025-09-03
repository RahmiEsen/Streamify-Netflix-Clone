import { Component } from '@angular/core';
import { ListHeaderComponent } from './list-header/list-header.component';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../core/models/movie.model';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, ListHeaderComponent, MovieCardComponent],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss',
})
export class MovieListComponent {
  movies: Movie[] = [
    { id: 1, title: 'Show 1', imageUrl: 'assets/shows/1.webp' },
    { id: 2, title: 'Show 2', imageUrl: 'assets/shows/2.webp' },
    { id: 3, title: 'Show 3', imageUrl: 'assets/shows/3.webp' },
    { id: 4, title: 'Show 4', imageUrl: 'assets/shows/4.webp' },
    { id: 5, title: 'Show 5', imageUrl: 'assets/shows/5.jpg' },
    { id: 6, title: 'Show 6', imageUrl: 'assets/shows/6.jpg' },
    { id: 6, title: 'Show 7', imageUrl: 'assets/shows/7.webp' },
  ];
}
