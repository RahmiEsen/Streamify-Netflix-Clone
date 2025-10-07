import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'browse',
    loadChildren: () =>
      import('./features/browse/browse.routes').then((m) => m.BROWSE_ROUTES),
  },
  {
    path: 'series',
    loadChildren: () =>
      import('./features/series/series.routes').then((m) => m.SERIES_ROUTES),
  },
  {
    path: 'movies',
    loadChildren: () =>
      import('./features/movies/movies.routes').then((m) => m.MOVIES_ROUTES),
  },
  {
    path: 'latest',
    loadChildren: () =>
      import('./features/latest/lates.routes').then((m) => m.LATES_ROUTES),
  },
  {
    path: 'my-list',
    loadChildren: () =>
      import('./features/my-list/list.routes').then((m) => m.LIST_ROUTES),
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./features/account/account.routes').then((m) => m.ACCOUNT_ROUTES),
  },
  {
    path: '',
    redirectTo: 'browse',
    pathMatch: 'full',
  },
];
