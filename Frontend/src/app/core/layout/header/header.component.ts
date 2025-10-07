import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  inject,
  HostListener,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { NavLink } from '../../models/nav-link.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly navigationService = inject(NavigationService);
  public readonly navLinks: ReadonlyArray<NavLink> =
    this.navigationService.getMainNavLinks();
  public readonly mobileNavLinks: ReadonlyArray<NavLink> =
    this.navigationService.getMobileBottomNavLinks();
  public isScrolled = false;

  public isNavHiddenOnMobile = false;
  private lastScrollY = 0;

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const currentScrollY = window.scrollY;
    this.isScrolled = currentScrollY > 0;
    if (window.innerWidth <= 800) {
      if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
        this.isNavHiddenOnMobile = true;
      } else if (currentScrollY < this.lastScrollY) {
        this.isNavHiddenOnMobile = false;
      }
    } else {
      this.isNavHiddenOnMobile = false;
    }
    this.lastScrollY = currentScrollY;
  }
}
