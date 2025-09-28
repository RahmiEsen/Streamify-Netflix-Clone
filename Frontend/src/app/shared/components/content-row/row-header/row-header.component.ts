import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderIndicatorComponent } from '../slider-indicator/slider-indicator.component';

@Component({
  selector: 'app-row-header',
  standalone: true,
  imports: [CommonModule, SliderIndicatorComponent],
  templateUrl: './row-header.component.html',
  styleUrl: './row-header.component.scss',
})
export class RowHeaderComponent {
  @Input() totalPages = 0;
  @Input() currentPage = 0;
  @Input() title: string = '';
  @Input() displayMode: 'default' | 'ranked' = 'default';
}
