import { ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-whatsapp-fab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './whatsapp-fab.component.html',
})
export class WhatsappFabComponent {
  readonly whatsappUrl = `https://wa.me/${environment.whatsappNumber}?text=${encodeURIComponent(
    `Hi! I'm visiting ${environment.brandName} website. I'd like to know more about your jewellery collection.`
  )}`;
}
