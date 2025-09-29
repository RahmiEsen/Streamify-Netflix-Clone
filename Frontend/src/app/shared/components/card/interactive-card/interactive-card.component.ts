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
import { Movie } from '../../../../core/models/movie.model';
import { GraphQLService } from '../../../../core/services/graphql.service';
import { map } from 'rxjs';

export interface OpenModalPayload {
  movie: Movie;
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
  @Input({ required: true }) movie!: Movie;
  @Input() isFirst: boolean = false;
  @Input() isLast: boolean = false;
  @Output() hoverStateChange = new EventEmitter<boolean>();
  @Output() openModal = new EventEmitter<OpenModalPayload>();

  isHovered = false;
  isAnimationReady = false;
  detailedMovie: Movie | null = null;

  private openTimer: any;
  private closeTimer: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    private graphqlService: GraphQLService
  ) {}

  requestOpenModal(): void {
    const originBounds = this.elementRef.nativeElement.getBoundingClientRect();
    this.openModal.emit({ movie: this.detailedMovie || this.movie, originBounds: originBounds });
  }

  onMouseEnter(): void {
    if (window.innerWidth < 1025) {
      return;
    }
    clearTimeout(this.closeTimer);
    this.openTimer = setTimeout(() => {
      this.isHovered = true;
      this.hoverStateChange.emit(true);
      if (!this.detailedMovie) {
        this.graphqlService
          .getMovieDetails(this.movie.id)
          .pipe(map((response) => response.data.movie))
          .subscribe((details) => {
            this.detailedMovie = details;
            this.cdr.detectChanges();
          });
      }
      this.cdr.detectChanges();
      setTimeout(() => {
        this.isAnimationReady = true;
        this.cdr.detectChanges();
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
