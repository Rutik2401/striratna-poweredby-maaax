import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SettingsService } from '../../../core/services/settings.service';

@Component({
  selector: 'app-whatsapp-fab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './whatsapp-fab.component.html',
})
export class WhatsappFabComponent {
  private readonly settings = inject(SettingsService);

  readonly whatsappUrl = computed(() => {
    const number = this.settings.whatsappNumber();
    const message = encodeURIComponent(this.settings.inquiryMessage());
    return `https://wa.me/${number}?text=${message}`;
  });
}
