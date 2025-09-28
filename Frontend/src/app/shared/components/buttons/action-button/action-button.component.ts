import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-action-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './action-button.component.html',
  styleUrl: './action-button.component.scss',
})
export class ActionButtonComponent {
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() icon: string = '';
  @Input() text: string = '';
}
