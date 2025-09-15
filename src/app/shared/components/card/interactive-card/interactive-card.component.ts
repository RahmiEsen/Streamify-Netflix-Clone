import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleDetailComponent } from '../title-detail/title-detail.component';
import { Movie } from '../../../../core/models/movie.model';

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
}
