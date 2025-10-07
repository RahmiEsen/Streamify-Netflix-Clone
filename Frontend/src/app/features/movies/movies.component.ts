import { Component } from '@angular/core';
import { HeroBannerComponent } from '../../shared/components/hero-banner/hero-banner.component';
import { ContentRowComponent } from '../../shared/components/content-row/content-row.component';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [HeroBannerComponent, ContentRowComponent],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss',
})
export class MoviesComponent {}
