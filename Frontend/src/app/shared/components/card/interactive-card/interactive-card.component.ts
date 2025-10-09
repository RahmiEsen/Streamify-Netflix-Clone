import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleDetailComponent } from '../title-detail/title-detail.component';
import { GraphQLService } from '../../../../core/services/graphql.service';
import { Media, Movie, Series } from '../../../../core/models/media.model';
import { take } from 'rxjs';

export interface OpenModalPayload {
  media: Media;
  originBounds: DOMRect;
}

@Component({
  selector: 'app-interactive-card',
  standalone: true,
  imports: [CommonModule, TitleDetailComponent],
  templateUrl: './interactive-card.component.html',
  styleUrls: ['./interactive-card.component.scss'],
})
export class InteractiveCardComponent {
  @Input({ required: true }) movie!: Movie | Series;
  @Input() isFirst: boolean = false;
  @Input() isLast: boolean = false;
  @Output() hoverStateChange = new EventEmitter<boolean>();
  @Output() openModal = new EventEmitter<OpenModalPayload>();

  isHovered = false;
  isAnimationReady = false;
  detailedMovie: Movie | Series | null = null;

  private openTimer: any;
  private closeTimer: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    private graphqlService: GraphQLService,
  ) {}

  requestOpenModal(): void {
    const originBounds = this.elementRef.nativeElement.getBoundingClientRect();
    this.openModal.emit({
      media: this.detailedMovie || this.movie,
      originBounds: originBounds,
    });
  }

  onMouseEnter(): void {
    if (window.innerWidth < 1025) return;

    clearTimeout(this.closeTimer);
    this.openTimer = setTimeout(() => {
      if (!this.movie) return;

      this.isHovered = true;
      this.hoverStateChange.emit(true);

      if (!this.detailedMovie) {
        this.graphqlService
          .getMediaById(
            this.movie.id,
            this.movie.__typename === 'Movie' ? 'movie' : 'tv',
          )
          .pipe(take(1))
          .subscribe((details: Movie | Series | null) => {
            if (!details) return; // ✅ null-Guard
            this.detailedMovie = details;
            this.cdr.markForCheck();
          });
      }

      this.cdr.markForCheck();
      setTimeout(() => {
        this.isAnimationReady = true;
        this.cdr.markForCheck();
      }, 10);
    }, 400);
  }

  onMouseLeave(): void {
    clearTimeout(this.openTimer);
    this.isAnimationReady = false;
    this.closeTimer = setTimeout(() => {
      this.isHovered = false;
      this.hoverStateChange.emit(false);
      this.cdr.detectChanges();
    }, 300);
  }
}
