import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconButtonComponent } from '../../buttons/icon-button/icon-button.component';
import { Movie } from '../../../../core/models/movie.model';

@Component({
  selector: 'app-age-rating',
  standalone: true,
  imports: [IconButtonComponent],
  templateUrl: './age-rating.component.html',
  styleUrl: './age-rating.component.scss',
})
export class AgeRatingComponent {
  @Input() icon: string = '';
  @Input() fsk: string | undefined | null;
  @Output() buttonClick = new EventEmitter<void>();

  onButtonClick(): void {
    this.buttonClick.emit();
  }
}
