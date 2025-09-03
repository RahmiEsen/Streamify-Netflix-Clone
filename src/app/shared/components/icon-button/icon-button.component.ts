import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss',
})
export class IconButtonComponent {
  @Input() icon: string = '';
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() tooltip: string = '';
  @Output() clicked = new EventEmitter<void>();

  onButtonClick(): void {
    this.clicked.emit();
  }
}
