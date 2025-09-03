import { Component } from '@angular/core';
import { HeroMetaComponent } from './hero-meta/hero-meta.component';
import { AgeRatingComponent } from './age-rating/age-rating.component';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [HeroMetaComponent, AgeRatingComponent],
  templateUrl: './hero-banner.component.html',
  styleUrl: './hero-banner.component.scss',
})
export class HeroBannerComponent {}
