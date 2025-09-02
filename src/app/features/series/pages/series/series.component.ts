import { Component } from '@angular/core';
import { HeroBannerComponent } from '../../../../shared/components/hero-banner/hero-banner.component';
import { MovieListComponent } from '../../../../shared/components/movie-list/movie-list.component';

@Component({
  selector: 'app-series',
  standalone: true,
  imports: [HeroBannerComponent, MovieListComponent],
  templateUrl: './series.component.html',
  styleUrl: './series.component.scss',
})
export class SeriesComponent {}
