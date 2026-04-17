import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  readonly messageSent = signal(false);

  readonly whatsappUrl = `https://wa.me/${environment.whatsappNumber}?text=${encodeURIComponent(
    `Hi! I'm visiting ${environment.brandName} website and would like to get in touch.`
  )}`;

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
    window.open(`https://wa.me/${environment.whatsappNumber}?text=${body}`, '_blank');
    this.messageSent.set(true);
  }
}
