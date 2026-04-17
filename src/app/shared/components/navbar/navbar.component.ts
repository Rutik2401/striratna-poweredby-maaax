import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      [class]="scrolled() ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 lg:h-20">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2 group">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
              <span class="text-white font-heading font-bold text-lg">स्त्री</span>
            </div>
            <div class="hidden sm:block">
              <h1 class="font-heading text-xl font-bold text-maroon group-hover:text-gold-dark transition-colors">
                स्त्रीरत्न
              </h1>
              <p class="text-[10px] text-gray-500 -mt-1 tracking-wider">POWERED BY MAAAX</p>
            </div>
          </a>

          <!-- Desktop Nav -->
          <div class="hidden lg:flex items-center gap-8">
            @for (link of navLinks; track link.path) {
              <a
                [routerLink]="link.path"
                routerLinkActive="text-gold font-semibold"
                [routerLinkActiveOptions]="{ exact: link.path === '/' }"
                class="text-sm font-medium text-gray-700 hover:text-gold transition-colors relative
                       after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5
                       after:bg-gold after:transition-all hover:after:w-full"
              >
                {{ link.label }}
              </a>
            }
          </div>

          <!-- Right Actions -->
          <div class="flex items-center gap-3">
            <!-- Cart -->
            <a
              routerLink="/cart"
              class="relative p-2 rounded-full hover:bg-gold/10 transition-colors"
            >
              <svg class="w-6 h-6 text-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              @if (cartService.itemCount() > 0) {
                <span class="absolute -top-1 -right-1 w-5 h-5 bg-gold text-white text-xs font-bold
                             rounded-full flex items-center justify-center animate-[scaleIn_0.3s_ease-out]">
                  {{ cartService.itemCount() }}
                </span>
              }
            </a>

            <!-- Mobile Menu Toggle -->
            <button
              (click)="mobileOpen.set(!mobileOpen())"
              class="lg:hidden p-2 rounded-full hover:bg-gold/10 transition-colors"
            >
              <svg class="w-6 h-6 text-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                @if (mobileOpen()) {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                } @else {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      @if (mobileOpen()) {
        <div class="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-xl">
          <div class="px-4 py-4 space-y-1">
            @for (link of navLinks; track link.path) {
              <a
                [routerLink]="link.path"
                routerLinkActive="bg-gold/10 text-gold"
                [routerLinkActiveOptions]="{ exact: link.path === '/' }"
                (click)="mobileOpen.set(false)"
                class="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700
                       hover:bg-gold/10 hover:text-gold transition-all"
              >
                {{ link.label }}
              </a>
            }
          </div>
        </div>
      }
    </nav>

    <!-- Spacer -->
    <div class="h-16 lg:h-20"></div>
  `,
})
export class NavbarComponent {
  cartService = inject(CartService);
  mobileOpen = signal(false);
  scrolled = signal(false);

  navLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 20);
  }
}
