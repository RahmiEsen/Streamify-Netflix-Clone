import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../core/models/movie.model';
import { CardDetailComponent } from './card-detail/card-detail.component';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, CardDetailComponent],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent {
  @Input({ required: true }) movie!: Movie;
  @Input() isFirst: boolean = false;
  @Input() isLast: boolean = false;
  @Output() hoverStateChange = new EventEmitter<boolean>();

  isHovered = false;
  isAnimationReady = false;

  private openTimer: any;
  private closeTimer: any;

  constructor(private cdr: ChangeDetectorRef) {}

  onMouseEnter(): void {
    clearTimeout(this.closeTimer);
    this.openTimer = setTimeout(() => {
      this.isHovered = true;
      this.hoverStateChange.emit(true);
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

  cancelCloseTimer(): void {
    clearTimeout(this.closeTimer);
  }
}
