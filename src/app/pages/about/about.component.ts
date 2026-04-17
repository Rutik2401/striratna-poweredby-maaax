import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Stat {
  readonly value: string;
  readonly label: string;
}

interface Reason {
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

interface ValueItem {
  readonly symbol: string;
  readonly title: string;
  readonly description: string;
  readonly bg: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './about.component.html',
})
export class AboutComponent {
  readonly stats: readonly Stat[] = [
    { value: '10,000+', label: 'Happy Customers' },
    { value: '500+', label: 'Unique Designs' },
    { value: '4.8★', label: 'Avg Rating' },
    { value: '48hr', label: 'Dispatch' },
  ];

  readonly reasons: readonly Reason[] = [
    {
      icon: '✨',
      title: 'Lightweight Luxury',
      description: 'Premium 1gm art jewellery — all the glow of gold, a fraction of the weight and price.',
    },
    {
      icon: '💛',
      title: 'Handcrafted in Pune',
      description: 'Every piece is hand-finished by local artisans. No mass production, no shortcuts.',
    },
    {
      icon: '🛡️',
      title: '6-Month Guarantee',
      description: 'We stand behind every piece. Tarnish, bend, or break — we make it right.',
    },
    {
      icon: '🚀',
      title: 'Ships in 48 hours',
      description: 'Ready stock. Orders leave Pune within 2 business days to any corner of India.',
    },
    {
      icon: '💬',
      title: 'Real Human Support',
      description: 'WhatsApp us any time. Styling advice, size help, or just a friendly chat.',
    },
    {
      icon: '💎',
      title: 'Starts at ₹299',
      description: "Luxury jewellery shouldn't break the bank. Pieces for every budget, every occasion.",
    },
  ];

  readonly values: readonly ValueItem[] = [
    {
      symbol: '1gm',
      title: 'Lightweight Luxury',
      description: '1gm gold-look jewellery that feels comfortable all day long.',
      bg: 'linear-gradient(135deg, #D4AF37, #B8960F)',
    },
    {
      symbol: 'M',
      title: 'Maharashtra Heritage',
      description: 'Designs inspired by rich Maharashtrian traditions and culture.',
      bg: 'linear-gradient(135deg, #800020, #A0334D)',
    },
    {
      symbol: '₹',
      title: 'Affordable Price',
      description: 'Premium looks without breaking the bank — for every occasion.',
      bg: 'linear-gradient(135deg, #10B981, #059669)',
    },
  ];
}
