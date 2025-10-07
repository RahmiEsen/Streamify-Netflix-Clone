import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Renderer2,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroBannerComponent } from '../../shared/components/hero-banner/hero-banner.component';
import { ContentRowComponent } from '../../shared/components/content-row/content-row.component';
import { DetailModalComponent } from '../../shared/components/detail-modal/detail-modal.component';
import { OpenModalPayload } from '../../shared/components/card/interactive-card/interactive-card.component';
import { Movie } from '../../core/models/movie.model';
import { RANKING_SVG_DATA } from '../../core/data/ranking-svg.data';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { GraphQLService } from '../../core/services/graphql.service';
import { map } from 'rxjs';

export interface ContentRowData {
  rowTitle: string;
  items: (Movie | RankedItem)[];
  displayMode?: 'default' | 'ranked';
}

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
  public heroMovie: Movie | null = null;
  public contentRows: ContentRowData[] = [];
  public selectedMediaForModal: OpenModalPayload | null = null;

  constructor(
    private graphqlService: GraphQLService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.graphqlService
      .getBrowsePageData()
      .pipe(map((response) => response.data))
      .subscribe((apiResult: any) => {
        this.heroMovie = apiResult.heroMovie;
        const rankedItems = apiResult.popular
          .slice(0, 10)
          .map((movie: Movie, index: number) => {
            const svgData = RANKING_SVG_DATA[index];
            return { movie, ...svgData };
          });
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
        this.cdr.markForCheck();
      });
  }

  trackByRow(index: number, row: ContentRowData): string {
    return row.rowTitle;
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
