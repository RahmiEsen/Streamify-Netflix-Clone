import { Directive, OnInit } from '@angular/core';
import { Observable, forkJoin, map, take } from 'rxjs';
import { Media } from '../core/models/media.model';
import { GraphQLService } from '../core/services/graphql.service';
import { ContentRow } from '../core/models/content-row.model';
import { RANKING_SVG_DATA } from '../core/data/ranking-svg.data';
import { OpenModalPayload } from '../shared/components/detail-modal/detail-modal.component';

export interface MediaPageConfig {
  pageTitle: string;
  filterFn: (item: Media) => boolean;
  genres: { rowTitle: string; genreId: number }[];
}

@Directive()
export abstract class MediaPageComponent implements OnInit {
  heroMedia$!: Observable<Media | null>;
  contentRows$!: Observable<ContentRow[]>;
  selectedMediaForModal: OpenModalPayload | null = null;

  constructor(
    protected graphqlService: GraphQLService,
    private config: MediaPageConfig,
  ) {}

  ngOnInit(): void {
    const { filterFn, genres, pageTitle } = this.config;
    this.heroMedia$ = this.graphqlService.getPopularMedia().pipe(
      take(1),
      map((mediaList) => {
        const candidates = mediaList.filter(filterFn);
        return (
          candidates.find(
            (c) => c.imageSet?.heroBackdropUrlDesktop && c.overview,
          ) ||
          candidates[0] ||
          null
        );
      }),
    );
    const genreStreams = genres.reduce(
      (acc, genreConfig) => {
        acc[genreConfig.rowTitle] = this.graphqlService
          .getMediaByGenre(genreConfig.genreId)
          .pipe(take(1));
        return acc;
      },
      {} as Record<string, Observable<Media[]>>,
    );
    this.contentRows$ = forkJoin({
      popular: this.graphqlService.getPopularMedia().pipe(take(1)),
      topRated: this.graphqlService.getTopRatedMedia().pipe(take(1)),
      ...genreStreams,
    }).pipe(
      map((apiResult) => {
        const popularMedia = apiResult.popular.filter(filterFn);
        const topRatedMedia = apiResult.topRated.filter(filterFn);
        const rankedItems = popularMedia
          .slice(0, 10)
          .map((mediaItem, index) => {
            const svgData = RANKING_SVG_DATA[index];
            return {
              media: mediaItem,
              rank: svgData.rank,
              viewBox: svgData.viewBox,
              pathD: svgData.pathD,
            };
          });
        const genreRows = genres.map((genreConfig) => ({
          rowTitle: genreConfig.rowTitle,
          items: (
            (apiResult as Record<string, Media[]>)[genreConfig.rowTitle] || []
          ).filter(filterFn),
        }));
        return [
          { rowTitle: 'Von der Kritik gelobt', items: topRatedMedia },
          {
            rowTitle: `Top 10 ${pageTitle} in Deutschland heute`,
            items: rankedItems,
            displayMode: 'ranked',
          },
          ...genreRows,
        ];
      }),
    );
  }

  handleOpenModal(payload: OpenModalPayload): void {
    this.selectedMediaForModal = payload;
  }

  closeModal(): void {
    this.selectedMediaForModal = null;
  }

  trackByRow(index: number, row: ContentRow): string {
    return row.rowTitle;
  }
}
