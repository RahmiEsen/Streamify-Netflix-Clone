import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RowHeaderComponent } from './row-header/row-header.component';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../core/models/movie.model';
import { SliderControlComponent } from './slider-control/slider-control.component';
import { TitleCardComponent } from '../card/presenters/title-card/title-card.component';
import {
  InteractiveCardComponent,
  OpenModalPayload,
} from '../card/interactive-card/interactive-card.component';
import { RankedCardComponent } from '../card/presenters/ranked-card/ranked-card.component';
import { RankedItem } from '../../../features/browse/pages/browse/browse.component';
/* import { TMDB_CONFIG } from '../../../core/constants/api.constants'; */
import { BehaviorSubject } from 'rxjs';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentRowComponent {
  @Input() rowTitle: string = '';
  @Input() items: (Movie | RankedItem)[] = [];
  @Input() displayMode: 'default' | 'ranked' = 'default';
  @Output() openModal = new EventEmitter<OpenModalPayload>();

  isRowHovered = false;
  /* imageBaseUrl = TMDB_CONFIG.IMG_URL; */

  private readonly sliderTotalPages$$ = new BehaviorSubject<number>(0);
  public readonly sliderTotalPages$ = this.sliderTotalPages$$.asObservable();

  private readonly sliderCurrentPage$$ = new BehaviorSubject<number>(0);
  public readonly sliderCurrentPage$ = this.sliderCurrentPage$$.asObservable();

  onOpenModal(payload: OpenModalPayload): void {
    this.openModal.emit(payload);
  }

  onCardHoverChange(isHovered: boolean): void {
    this.isRowHovered = isHovered;
  }

  onPagesInitialized(totalPages: number): void {
    this.sliderTotalPages$$.next(totalPages);
  }

  onPageChange(currentPage: number): void {
    this.sliderCurrentPage$$.next(currentPage);
  }
}
