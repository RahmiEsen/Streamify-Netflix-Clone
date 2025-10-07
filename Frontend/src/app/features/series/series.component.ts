import { Component } from '@angular/core';
import { HeroBannerComponent } from '../../shared/components/hero-banner/hero-banner.component';
import { ContentRowComponent } from '../../shared/components/content-row/content-row.component';

@Component({
  selector: 'app-series',
  standalone: true,
  imports: [HeroBannerComponent, ContentRowComponent],
  templateUrl: './series.component.html',
  styleUrl: './series.component.scss',
})
export class SeriesComponent {}
