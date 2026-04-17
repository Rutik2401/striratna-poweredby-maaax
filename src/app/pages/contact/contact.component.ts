import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../core/services/settings.service';
import { environment } from '../../environments/environment';

interface ContactForm {
  name: string;
  phone: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  private readonly settings = inject(SettingsService);

  readonly messageSent = signal(false);

  readonly whatsappUrl = computed(() => {
    const number = this.settings.whatsappNumber();
    const message = encodeURIComponent(this.settings.inquiryMessage());
    return `https://wa.me/${number}?text=${message}`;
  });

  readonly contactEmail = computed(() => this.settings.contactEmail());
  readonly address = computed(() => this.settings.address());

  contactForm: ContactForm = {
    name: '',
    phone: '',
    message: '',
  };

  sendMessage(): void {
    const { name, phone, message } = this.contactForm;
    if (!name || !phone || !message) return;

    const body = encodeURIComponent(
      `Hi ${environment.brandName}!\n\nName: ${name}\nPhone: ${phone}\n\nMessage: ${message}`
    );
    window.open(`https://wa.me/${this.settings.whatsappNumber()}?text=${body}`, '_blank');
    this.messageSent.set(true);
  }
}
