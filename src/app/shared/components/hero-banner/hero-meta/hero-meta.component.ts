import { Component } from '@angular/core';
import { ActionButtonComponent } from '../../action-button/action-button.component';

@Component({
  selector: 'app-hero-meta',
  imports: [ActionButtonComponent],
  templateUrl: './hero-meta.component.html',
  styleUrl: './hero-meta.component.scss',
})
export class HeroMetaComponent {}
