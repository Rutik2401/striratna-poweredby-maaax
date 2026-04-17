import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../../../core/services/settings.service';

interface FooterLink {
  readonly path: string;
  readonly label: string;
}

interface CategoryLink {
  readonly tag: string;
  readonly label: string;
}

interface TrustBadge {
  readonly icon: string;
  readonly title: string;
  readonly subtitle: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  private readonly settings = inject(SettingsService);

  readonly year = new Date().getFullYear();

  readonly whatsappUrl = computed(() => {
    const number = this.settings.whatsappNumber();
    const message = encodeURIComponent(this.settings.inquiryMessage());
    return `https://wa.me/${number}?text=${message}`;
  });

  readonly instagramUrl = computed(() => this.settings.instagramUrl());
  readonly contactEmail = computed(() => this.settings.contactEmail());
  readonly address = computed(() => this.settings.address());

  readonly quickLinks: readonly FooterLink[] = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop All' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact' },
    { path: '/cart', label: 'Cart' },
  ];

  readonly categoryLinks: readonly CategoryLink[] = [
    { tag: 'bridal', label: 'Bridal' },
    { tag: 'festive', label: 'Festive' },
    { tag: 'daily', label: 'Daily Wear' },
    { tag: 'gift', label: 'Gifting' },
  ];

  readonly trustBadges: readonly TrustBadge[] = [
    { icon: '🚚', title: 'Free Shipping', subtitle: 'Above ₹999' },
    { icon: '🔄', title: 'Easy Returns', subtitle: '7-day policy' },
    { icon: '💰', title: 'Cash on Delivery', subtitle: 'Pay on receipt' },
    { icon: '🛡️', title: '6-Month Guarantee', subtitle: 'Quality assured' },
  ];
}
