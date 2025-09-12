import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderIndicatorComponent } from '../slider-indicator/slider-indicator.component';

@Component({
  selector: 'app-list-header',
  standalone: true,
  imports: [CommonModule, SliderIndicatorComponent],
  templateUrl: './list-header.component.html',
  styleUrl: './list-header.component.scss',
})
export class ListHeaderComponent {
  @Input() totalPages = 0;
  @Input() currentPage = 0;
}
