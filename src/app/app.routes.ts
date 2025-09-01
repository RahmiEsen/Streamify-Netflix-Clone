import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'browse',
    loadChildren: () => import('./features/browse/browse.routes').then((m) => m.BROWSE_ROUTES),
  },
  {
    path: 'search',
    loadChildren: () => import('./features/search/search.routes').then((m) => m.SEARCH_ROUTES),
  },
  {
    path: 'player/:id',
    loadChildren: () => import('./features/player/player.routes').then((m) => m.PLAYER_ROUTES),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./features/user-profile/user-profile.routes').then((m) => m.PROFILE_ROUTES),
  },
  {
    path: '',
    redirectTo: 'browse',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'browse',
  },
];
