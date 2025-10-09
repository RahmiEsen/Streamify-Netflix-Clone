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
  isMovie,
} from '../../core/services/graphql.service';

const MOVIES_CONFIG: MediaPageConfig = {
  pageTitle: 'Filme',
  filterFn: isMovie,
  genres: [
    { rowTitle: 'Action & Abenteuer', genreId: GENRE_IDS.ACTION },
    {
      rowTitle: 'Science Fiction-Highlights',
      genreId: GENRE_IDS.SCIENCE_FICTION,
    },
    { rowTitle: 'Klassische Dramen', genreId: GENRE_IDS.DRAMA },
    { rowTitle: 'Spannende Thriller', genreId: GENRE_IDS.THRILLER },
    { rowTitle: 'Komödien zum Entspannen', genreId: GENRE_IDS.COMEDY },
    { rowTitle: 'Mystery', genreId: GENRE_IDS.MYSTERY },
    { rowTitle: 'Dokumentationen', genreId: GENRE_IDS.DOCUMENTARY },
  ],
};

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [
    CommonModule,
    HeroBannerComponent,
    ContentRowComponent,
    DetailModalComponent,
  ],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss',
})
export class MoviesComponent extends MediaPageComponent {
  constructor(graphqlService: GraphQLService) {
    super(graphqlService, MOVIES_CONFIG);
  }
}
