import { Component } from '@angular/core';
import { HeroBannerComponent } from '../../shared/components/hero-banner/hero-banner.component';
import { ContentRowComponent } from '../../shared/components/content-row/content-row.component';

@Component({
  selector: 'app-latest',
  standalone: true,
  imports: [HeroBannerComponent, ContentRowComponent],
  templateUrl: './latest.component.html',
  styleUrl: './latest.component.scss',
})
export class LatestComponent {}
