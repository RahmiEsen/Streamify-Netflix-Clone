import { ChangeDetectionStrategy, Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroBannerComponent } from '../../../../shared/components/hero-banner/hero-banner.component';
import { ContentRowComponent } from '../../../../shared/components/content-row/content-row.component';
import { DetailModalComponent } from '../../../../shared/components/detail-modal/detail-modal.component';
import { OpenModalPayload } from '../../../../shared/components/card/interactive-card/interactive-card.component';
import { MovieApiService } from '../../../../core/services/api/movie-api.service';
import { Movie } from '../../../../core/models/movie.model';
import { TMDB_CONFIG } from '../../../../core/constants/api.constants';
import { RANKING_SVG_DATA } from '../../../../core/data/ranking-svg.data';
import { forkJoin } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';

// Interface für die Struktur einer einzelnen Inhaltsreihe
export interface ContentRowData {
  rowTitle: string;
  items: (Movie | RankedItem)[];
  displayMode?: 'default' | 'ranked';
}

// Interface für die gerankten Top-10 Titel
export interface RankedItem {
  movie: Movie;
  rank: number;
  viewBox: string;
  pathD: string;
}

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [
    CommonModule,
    HeroBannerComponent,
    ContentRowComponent,
    DetailModalComponent,
    ScrollingModule,
  ],
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowseComponent implements OnInit {
  public contentRows: ContentRowData[] = [];
  public imageBaseUrl = TMDB_CONFIG.IMG_URL;
  public selectedMediaForModal: OpenModalPayload | null = null;

  constructor(
    private movieApi: MovieApiService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    forkJoin({
      topRated: this.movieApi.getTopRatedMovies(),
      horror: this.movieApi.getMoviesByGenre(27),
      comedy: this.movieApi.getMoviesByGenre(35),
      thriller: this.movieApi.getMoviesByGenre(53),
      crime: this.movieApi.getMoviesByGenre(80),
      drama: this.movieApi.getMoviesByGenre(18),
      documentary: this.movieApi.getMoviesByGenre(99),
      popular: this.movieApi.getPopularMovies(),
    }).subscribe((apiResult) => {
      // Erstelle die gerankte Top-10-Liste
      const rankedItems = apiResult.popular.slice(0, 10).map((movie: Movie, index: number) => {
        const svgData = RANKING_SVG_DATA[index];
        return { movie, ...svgData };
      });

      // Baue das einzige Array auf, das alle Reihen enthält
      this.contentRows = [
        {
          rowTitle: 'Von der Kritik gelobte Filme',
          items: apiResult.topRated.slice(0, 24),
        },
        {
          rowTitle: 'Top-10-Filme in Deutschland heute',
          items: rankedItems,
          displayMode: 'ranked',
        },
        {
          rowTitle: 'Horror',
          items: apiResult.horror.slice(0, 24),
        },
        {
          rowTitle: 'Thriller',
          items: apiResult.thriller.slice(0, 24),
        },
        {
          rowTitle: 'Komödien',
          items: apiResult.comedy.slice(0, 24),
        },
        {
          rowTitle: 'Krimis',
          items: apiResult.crime.slice(0, 24),
        },
        {
          rowTitle: 'Drama',
          items: apiResult.drama.slice(0, 24),
        },
        {
          rowTitle: 'Dokumentationen',
          items: apiResult.documentary.slice(0, 24),
        },
      ];
    });
  }

  // trackBy-Funktion für die Optimierung der *cdkVirtualFor-Schleife
  trackByRow(index: number, row: ContentRowData): string {
    return row.rowTitle; // Eindeutiger Bezeichner für eine Reihe
  }

  handleOpenModal(payload: OpenModalPayload): void {
    this.selectedMediaForModal = payload;
    this.renderer.addClass(document.body, 'modal-open');
  }

  closeModal(): void {
    this.selectedMediaForModal = null;
    this.renderer.removeClass(document.body, 'modal-open');
  }
}
