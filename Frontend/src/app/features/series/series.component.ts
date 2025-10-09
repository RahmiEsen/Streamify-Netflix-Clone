import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroBannerComponent } from '../../shared/components/hero-banner/hero-banner.component';
import { ContentRowComponent } from '../../shared/components/content-row/content-row.component';
import { DetailModalComponent } from '../../shared/components/detail-modal/detail-modal.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {
  MediaPageComponent,
  MediaPageConfig,
} from '../media-page.base.component';
import {
  GraphQLService,
  GENRE_IDS,
  isSeries,
} from '../../core/services/graphql.service';

// Die einzigartige Konfiguration für die Serien-Seite
const SERIES_CONFIG: MediaPageConfig = {
  pageTitle: 'Serien',
  filterFn: isSeries,
  genres: [
    { rowTitle: 'Drama', genreId: GENRE_IDS.DRAMA },
    { rowTitle: 'Animation', genreId: GENRE_IDS.ANIMATION },
    { rowTitle: 'Krimis', genreId: GENRE_IDS.CRIME },
  ],
};

@Component({
  selector: 'app-series',
  standalone: true,
  imports: [
    CommonModule,
    HeroBannerComponent,
    ContentRowComponent,
    DetailModalComponent,
    ScrollingModule,
  ],
  templateUrl: './series.component.html',
  styleUrl: './series.component.scss',
})
export class SeriesComponent extends MediaPageComponent {
  constructor(graphqlService: GraphQLService) {
    // Übergib den Service und die Serien-Konfiguration an die Base-Klasse
    super(graphqlService, SERIES_CONFIG);
  }
}
