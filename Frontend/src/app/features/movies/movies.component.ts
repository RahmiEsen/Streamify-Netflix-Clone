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
  isMovie,
} from '../../core/services/graphql.service';

const MOVIES_CONFIG: MediaPageConfig = {
  pageTitle: 'Filme',
  filterFn: isMovie,
  genres: [
    { rowTitle: 'Horror', genreId: GENRE_IDS.HORROR },
    { rowTitle: 'Thriller', genreId: GENRE_IDS.THRILLER },
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
    ScrollingModule,
  ],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss',
})
export class MoviesComponent extends MediaPageComponent {
  constructor(graphqlService: GraphQLService) {
    super(graphqlService, MOVIES_CONFIG);
  }
}
