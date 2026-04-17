import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface AboutFeature {
  readonly icon: string;
  readonly title: string;
  readonly desc: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './about.component.html',
})
export class AboutComponent {
  readonly features: readonly AboutFeature[] = [
    { icon: '🔍', title: 'Browse Anytime', desc: 'No waiting for replies, explore at your pace' },
    { icon: '💰', title: 'See Prices Instantly', desc: 'All prices clearly displayed' },
    { icon: '🛒', title: 'Order in Seconds', desc: 'Add to cart and checkout seamlessly' },
    { icon: '📱', title: 'WhatsApp Confirmation', desc: 'Order confirmation directly on WhatsApp' },
  ];
}
