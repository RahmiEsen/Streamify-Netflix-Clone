import { Component } from '@angular/core';
import { HeroBannerComponent } from '../../../../shared/components/hero-banner/hero-banner.component';
import { MovieListComponent } from '../../../../shared/components/movie-list/movie-list.component';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [HeroBannerComponent, MovieListComponent],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss',
})
export class MoviesComponent {}
