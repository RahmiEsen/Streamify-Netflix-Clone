import { Component, OnInit, Renderer2 } from '@angular/core';
import { HeroBannerComponent } from '../../../../shared/components/hero-banner/hero-banner.component';
import { ContentRowComponent } from '../../../../shared/components/content-row/content-row.component';
import { Movie } from '../../../../core/models/movie.model';
import { TITLE_DATA } from '../../../../core/data/title.data';
import { RANKED_DATA } from '../../../../core/data/ranked.data';
import { RANKING_SVG_DATA } from '../../../../core/data/ranking-svg.data';
import { DetailModalComponent } from '../../../../shared/components/detail-modal/detail-modal.component';
import { CommonModule } from '@angular/common';
import { OpenModalPayload } from '../../../../shared/components/card/interactive-card/interactive-card.component';

export interface RankedItem {
  movie: Movie;
  rank: number;
  viewBox: string;
  pathD: string;
}

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule, HeroBannerComponent, ContentRowComponent, DetailModalComponent],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss',
})
export class BrowseComponent implements OnInit {
  allTestTitles: Movie[] = TITLE_DATA;
  rankedTitles: RankedItem[] = [];
  selectedMediaForModal: OpenModalPayload | null = null;

  constructor(private renderer: Renderer2) {}

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

  handleOpenModal(payload: OpenModalPayload): void {
    this.selectedMediaForModal = payload;
    this.renderer.addClass(document.body, 'modal-open');
  }

  closeModal(): void {
    this.selectedMediaForModal = null;
    this.renderer.removeClass(document.body, 'modal-open');
  }
}
