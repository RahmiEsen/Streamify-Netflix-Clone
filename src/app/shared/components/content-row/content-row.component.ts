import { Component, Input } from '@angular/core';
import { RowHeaderComponent } from './row-header/row-header.component';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../core/models/movie.model';
import { SliderControlComponent } from './slider-control/slider-control.component';
import { TitleCardComponent } from '../card/presenters/title-card/title-card.component';
import { InteractiveCardComponent } from '../card/interactive-card/interactive-card.component';
import { RankedCardComponent } from '../card/presenters/ranked-card/ranked-card.component';
import { RankedItem } from '../../../features/browse/pages/browse/browse.component';

@Component({
  selector: 'app-content-row',
  standalone: true,
  imports: [
    CommonModule,
    RowHeaderComponent,
    SliderControlComponent,
    TitleCardComponent,
    InteractiveCardComponent,
    RankedCardComponent,
  ],
  templateUrl: './content-row.component.html',
  styleUrl: './content-row.component.scss',
})
export class ContentRowComponent {
  @Input() rowTitle: string = '';
  @Input() items: (Movie | RankedItem)[] = [];
  @Input() displayMode: 'default' | 'ranked' = 'default';
  @Input() visibleItems = 6;

  isRowHovered = false;
  sliderTotalPages = 0;
  sliderCurrentPage = 0;

  onCardHoverChange(isHovered: boolean): void {
    this.isRowHovered = isHovered;
  }

  onPagesInitialized(totalPages: number): void {
    setTimeout(() => {
      this.sliderTotalPages = totalPages;
    });
  }

  onPageChange(currentPage: number): void {
    this.sliderCurrentPage = currentPage;
  }
}
