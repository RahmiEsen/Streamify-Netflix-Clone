import { Component } from '@angular/core';
import { HeroMetaComponent } from './hero-meta/hero-meta.component';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [HeroMetaComponent],
  templateUrl: './hero-banner.component.html',
  styleUrl: './hero-banner.component.scss',
})
export class HeroBannerComponent {}
