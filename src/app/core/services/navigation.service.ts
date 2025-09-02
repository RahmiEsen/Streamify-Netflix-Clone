import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NavLink } from '../models/nav-link.model';
import { APP_ROUTES } from '../constants/routes.constants';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly mainNavLinks: ReadonlyArray<NavLink> = [
    { path: APP_ROUTES.BROWSE, label: 'Startseite', exact: true },
    { path: APP_ROUTES.SERIES, label: 'Serien' },
    { path: APP_ROUTES.MOVIES, label: 'Filme' },
    { path: APP_ROUTES.LATEST, label: 'Neu und Beliebt' },
    { path: APP_ROUTES.MY_LIST, label: 'Meine Liste' },
  ];
  public getMainNavLinks(): Observable<ReadonlyArray<NavLink>> {
    return of(this.mainNavLinks);
  }
}
