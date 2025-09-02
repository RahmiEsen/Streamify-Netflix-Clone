import { Routes } from '@angular/router';
import { MoviesComponent } from './pages/movies/movies.component';

export const MOVIES_ROUTES: Routes = [
  {
    path: '',
    component: MoviesComponent,
    title: 'Filme-Netflix',
  },
];
