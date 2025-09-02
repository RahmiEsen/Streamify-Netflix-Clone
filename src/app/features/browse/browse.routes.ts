import { Routes } from '@angular/router';
import { BrowseComponent } from './pages/browse/browse.component';

export const BROWSE_ROUTES: Routes = [
  {
    path: '',
    component: BrowseComponent,
    title: 'Startseite-Netflix',
  },
];
