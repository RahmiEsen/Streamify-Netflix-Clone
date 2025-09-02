import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

export interface NavLink {
  path: string;
  label: string;
  exact?: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  public navLinks: NavLink[] = [
    { path: '/browse', label: 'Startseite', exact: true },
    { path: '/series', label: 'Serien' },
    { path: '/movies', label: 'Filme' },
    { path: '/latest', label: 'Neu und Beliebt' },
    { path: '/my-list', label: 'Meine Liste' },
  ];
}
