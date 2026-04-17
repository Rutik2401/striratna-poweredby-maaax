import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Hero -->
    <section class="bg-gradient-to-r from-maroon to-maroon-dark text-white py-12 lg:py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="font-heading text-3xl lg:text-5xl font-bold mb-3">Contact Us</h1>
        <p class="text-white/70">We'd love to hear from you</p>
      </div>
    </section>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Contact Info -->
        <div class="space-y-8">
          <div>
            <h2 class="font-heading text-2xl font-bold text-maroon mb-4">Get in Touch</h2>
            <p class="text-gray-600 leading-relaxed">
              Have questions about our jewellery? Want to place a custom order?
              Reach out to us through any of these channels.
            </p>
          </div>

          <div class="space-y-5">
            <!-- WhatsApp -->
            <a [href]="whatsappUrl" target="_blank" rel="noopener"
               class="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all group">
              <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                  WhatsApp (Fastest)
                </h3>
                <p class="text-sm text-gray-500">Chat with us directly</p>
              </div>
            </a>

            <!-- Email -->
            <div class="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm">
              <div class="w-12 h-12 bg-maroon rounded-full flex items-center justify-center shrink-0">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-gray-900">Email</h3>
                <p class="text-sm text-gray-500">contact&#64;striratna.in</p>
              </div>
            </div>

            <!-- Location -->
            <div class="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm">
              <div class="w-12 h-12 bg-gold rounded-full flex items-center justify-center shrink-0">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-gray-900">Location</h3>
                <p class="text-sm text-gray-500">Pune, Maharashtra, India</p>
              </div>
            </div>
          </div>

          <!-- Business Hours -->
          <div class="bg-cream rounded-2xl p-6">
            <h3 class="font-heading text-lg font-semibold text-maroon mb-3">Business Hours</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Monday - Saturday</span>
                <span class="font-medium text-gray-900">10:00 AM - 8:00 PM</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Sunday</span>
                <span class="font-medium text-gray-900">11:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="bg-white rounded-2xl p-8 shadow-sm h-fit">
          <h2 class="font-heading text-2xl font-bold text-maroon mb-6">Send a Message</h2>

          @if (messageSent()) {
            <div class="text-center py-8">
              <div class="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 class="font-heading text-lg font-semibold text-gray-900 mb-1">Message Sent!</h3>
              <p class="text-sm text-gray-500">We'll get back to you soon.</p>
            </div>
          } @else {
            <form (ngSubmit)="sendMessage()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" [(ngModel)]="contactForm.name" name="name" required
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                  placeholder="Your name" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" [(ngModel)]="contactForm.phone" name="phone" required
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                  placeholder="Your phone number" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea [(ngModel)]="contactForm.message" name="message" required rows="4"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none
                         focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                  placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit"
                class="w-full px-6 py-4 bg-gradient-to-r from-maroon to-maroon-dark text-white
                       font-semibold rounded-full shadow-lg active:scale-95 transition-all">
                Send Message via WhatsApp
              </button>
            </form>
          }
        </div>
      </div>
    </div>
  `,
})
export class ContactComponent {
  messageSent = signal(false);

  whatsappUrl = `https://wa.me/${environment.whatsappNumber}?text=${encodeURIComponent(
    `Hi! I'm visiting ${environment.brandName} website and would like to get in touch.`
  )}`;

  contactForm = {
    name: '',
    phone: '',
    message: '',
  };

  sendMessage(): void {
    if (!this.contactForm.name || !this.contactForm.phone || !this.contactForm.message) return;

    const msg = encodeURIComponent(
      `Hi ${environment.brandName}!\n\nName: ${this.contactForm.name}\nPhone: ${this.contactForm.phone}\n\nMessage: ${this.contactForm.message}`
    );
    window.open(`https://wa.me/${environment.whatsappNumber}?text=${msg}`, '_blank');
    this.messageSent.set(true);
  }
}
