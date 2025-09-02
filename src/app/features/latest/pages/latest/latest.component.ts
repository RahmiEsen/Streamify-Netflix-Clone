import { Component } from '@angular/core';
import { HeroBannerComponent } from '../../../../shared/components/hero-banner/hero-banner.component';
import { MovieListComponent } from '../../../../shared/components/movie-list/movie-list.component';

@Component({
  selector: 'app-latest',
  standalone: true,
  imports: [HeroBannerComponent, MovieListComponent],
  templateUrl: './latest.component.html',
  styleUrl: './latest.component.scss',
})
export class LatestComponent {}
