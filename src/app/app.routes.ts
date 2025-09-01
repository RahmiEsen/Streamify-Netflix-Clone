import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'browse',
    loadChildren: () => import('./features/browse/browse.routes').then((m) => m.BROWSE_ROUTES),
  },
];
