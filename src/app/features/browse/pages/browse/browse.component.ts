import { Component, OnInit } from '@angular/core';
import { HeroBannerComponent } from '../../../../shared/components/hero-banner/hero-banner.component';
import { ContentRowComponent } from '../../../../shared/components/content-row/content-row.component';
import { Movie } from '../../../../core/models/movie.model';
import { TITLE_DATA } from '../../../../core/data/title.data';
import { RANKED_DATA } from '../../../../core/data/ranked.data';
import { RANKING_SVG_DATA } from '../../../../core/data/ranking-svg.data';

export interface RankedItem {
  movie: Movie;
  rank: number;
  viewBox: string;
  pathD: string;
}

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [HeroBannerComponent, ContentRowComponent],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss',
})
export class BrowseComponent implements OnInit {
  allTestTitles: Movie[] = TITLE_DATA;
  rankedTitles: RankedItem[] = [];

  ngOnInit(): void {
    this.buildTop10List();
  }

  private buildTop10List(): void {
    this.rankedTitles = RANKED_DATA.map((movie, index) => {
      const svgData = RANKING_SVG_DATA[index];
      return {
        movie: movie,
        rank: svgData.rank,
        viewBox: svgData.viewBox,
        pathD: svgData.pathD,
      };
    });
  }
}
