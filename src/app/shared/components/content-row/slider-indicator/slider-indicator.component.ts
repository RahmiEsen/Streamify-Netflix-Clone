import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-slider-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider-indicator.component.html',
  styleUrl: './slider-indicator.component.scss',
})
export class SliderIndicatorComponent {
  @Input() totalPages: number = 0;
  @Input() currentPage: number = 0;

  get pages(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i);
  }
}
