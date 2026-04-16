import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
  ],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-[1000] bg-gradient-to-br from-maroon to-maroon-dark transition-shadow duration-300"
         [class.shadow-2xl]="scrolled()"
         [class.shadow-md]="!scrolled()">
      <div class="max-w-[1200px] mx-auto flex items-center justify-between px-6 h-16">
        <!-- Brand -->
        <a routerLink="/" class="no-underline flex items-center gap-2">
          <span class="font-['Playfair_Display',serif] text-[1.6rem] font-bold text-gold tracking-wide">स्त्रीरत्न</span>
        </a>

        <!-- Desktop Navigation -->
        <ul class="hidden md:flex list-none gap-8 m-0 p-0">
          @for (link of navLinks; track link.path) {
            <li>
              <a [routerLink]="link.path"
                 routerLinkActive="!text-gold after:!w-full"
                 [routerLinkActiveOptions]="{ exact: link.path === '/' }"
                 class="nav-link-underline no-underline text-cream font-['Playfair_Display',serif] text-base font-medium relative py-1 transition-colors duration-300 hover:text-gold">
                {{ link.label }}
              </a>
            </li>
          }
        </ul>

        <div class="flex items-center gap-3">
          <!-- Cart -->
          <a routerLink="/cart" class="relative text-gold no-underline flex items-center cursor-pointer transition-transform duration-200 hover:scale-110" aria-label="Cart">
            <span class="material-icons text-[28px]">shopping_cart</span>
            <ng-container *ngIf="(cartService.cartCount$ | async) as count">
              <span *ngIf="count > 0" class="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {{ count }}
              </span>
            </ng-container>
          </a>

          <!-- Mobile Hamburger -->
          <button class="md:hidden flex bg-transparent border-none cursor-pointer text-gold p-1" (click)="toggleMenu()" aria-label="Menu">
            <span class="material-icons text-[28px]">{{ menuOpen() ? 'close' : 'menu' }}</span>
          </button>
        </div>
      </div>

      <!-- Mobile Overlay -->
      @if (menuOpen()) {
        <div class="md:hidden fixed inset-0 bg-black/50 z-[1001]" (click)="toggleMenu()"></div>
      }

      <!-- Mobile Slide-in Menu -->
      <div class="md:block hidden-until-mobile fixed top-0 right-0 w-[280px] h-screen bg-gradient-to-b from-maroon to-maroon-dark z-[1002] transition-transform duration-300 p-8 shadow-[-4px_0_16px_rgba(0,0,0,0.3)]"
           [class.translate-x-0]="menuOpen()"
           [class.translate-x-full]="!menuOpen()">
        <div class="font-['Playfair_Display',serif] text-2xl font-bold text-gold mb-8 pb-4 border-b border-gold/30">स्त्रीरत्न</div>
        <ul class="list-none p-0 m-0 flex flex-col gap-2">
          @for (link of navLinks; track link.path) {
            <li>
              <a [routerLink]="link.path"
                 routerLinkActive="bg-gold/15 text-gold"
                 [routerLinkActiveOptions]="{ exact: link.path === '/' }"
                 class="no-underline text-cream font-['Playfair_Display',serif] text-lg py-3 px-4 rounded-lg transition-all duration-200 block hover:bg-gold/15 hover:text-gold"
                 (click)="toggleMenu()">
                {{ link.label }}
              </a>
            </li>
          }
          <li>
            <a routerLink="/cart" class="no-underline text-cream font-['Playfair_Display',serif] text-lg py-3 px-4 rounded-lg transition-all duration-200 block hover:bg-gold/15 hover:text-gold" (click)="toggleMenu()">
              Cart ({{ cartService.cartCount$ | async }})
            </a>
          </li>
        </ul>
      </div>
    </nav>
    <!-- Spacer to prevent content from hiding behind fixed navbar -->
    <div class="h-16"></div>
  `,
  styles: [`
    .nav-link-underline::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: #D4AF37;
      transition: width 0.3s ease;
    }
    .nav-link-underline:hover::after {
      width: 100%;
    }

    /* Mobile menu: hidden on desktop, shown as block on mobile for slide transition */
    .hidden-until-mobile {
      display: none;
    }
    @media (max-width: 767px) {
      .hidden-until-mobile {
        display: block;
      }
    }
  `],
})
export class NavbarComponent {
  readonly cartService = inject(CartService);
  readonly menuOpen = signal(false);
  readonly scrolled = signal(false);

  readonly navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.scrolled.set(window.scrollY > 20);
      });
    }
  }

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }
}
