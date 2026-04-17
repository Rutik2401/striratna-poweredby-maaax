import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

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
  readonly year = new Date().getFullYear();

  readonly whatsappUrl = `https://wa.me/${environment.whatsappNumber}?text=${encodeURIComponent(
    `Hi! I'd like to know more about ${environment.brandName} jewellery.`
  )}`;

  readonly instagramUrl = 'https://instagram.com/';

  readonly quickLinks: readonly FooterLink[] = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
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
