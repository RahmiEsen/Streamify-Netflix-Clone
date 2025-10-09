import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroBannerComponent } from '../../shared/components/hero-banner/hero-banner.component';
import { ContentRowComponent } from '../../shared/components/content-row/content-row.component';
import { DetailModalComponent } from '../../shared/components/detail-modal/detail-modal.component';
import {
  MediaPageComponent,
  MediaPageConfig,
} from '../media-page.base.component';
import {
  GraphQLService,
  GENRE_IDS,
  isSeries,
} from '../../core/services/graphql.service';

const SERIES_CONFIG: MediaPageConfig = {
  pageTitle: 'Serien',
  filterFn: isSeries,
  genres: [
    { rowTitle: 'Top-Dramaserien', genreId: GENRE_IDS.DRAMA },
    { rowTitle: 'Fesselnde Krimis', genreId: GENRE_IDS.CRIME },
    { rowTitle: 'Familienunterhaltung', genreId: GENRE_IDS.FAMILY },
    { rowTitle: 'Animationsserien', genreId: GENRE_IDS.ANIMATION },
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
  ],
  templateUrl: './series.component.html',
  styleUrl: './series.component.scss',
})
export class SeriesComponent extends MediaPageComponent {
  constructor(graphqlService: GraphQLService) {
    super(graphqlService, SERIES_CONFIG);
  }
}
