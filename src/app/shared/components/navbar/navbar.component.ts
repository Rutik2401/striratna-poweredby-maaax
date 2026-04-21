import { ChangeDetectionStrategy, Component, HostListener, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { AuthService } from '../../../core/services/auth.service';

interface NavLink {
  readonly path: string;
  readonly label: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly authService = inject(AuthService);

  readonly cartCount = this.cartService.itemCount;
  readonly wishlistCount = this.wishlistService.count;
  readonly mobileOpen = signal(false);
  readonly scrolled = signal(false);
  readonly adminRoute = computed(() =>
    this.authService.isLoggedIn() ? '/admin/dashboard' : '/admin/login',
  );

  readonly navLinks: readonly NavLink[] = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 20);
  }

  toggleMobile(): void {
    this.mobileOpen.update((v) => !v);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }
}
