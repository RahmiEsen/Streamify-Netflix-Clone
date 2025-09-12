import { Component } from '@angular/core';
import { IconButtonComponent } from '../icon-button/icon-button.component';

@Component({
  selector: 'app-rating-buttons',
  standalone: true,
  imports: [IconButtonComponent],
  templateUrl: './rating-buttons.component.html',
  styleUrl: './rating-buttons.component.scss',
})
export class RatingButtonsComponent {}
