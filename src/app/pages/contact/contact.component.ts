import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  template: `
    <div class="max-w-[1000px] mx-auto p-4 md:p-6">
      <h1 class="text-center text-2xl md:text-3xl font-bold text-maroon mb-2">Contact Us</h1>
      <div class="w-[60px] h-[3px] bg-gold mx-auto mb-8"></div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Contact Info -->
        <div>
          <!-- WhatsApp Card -->
          <a
            href="https://wa.me/919999999999?text=Hi!%20I%20have%20a%20query%20about%20your%20jewelry"
            target="_blank"
            class="flex items-center gap-4 p-5 rounded-xl text-white mb-4 no-underline hover:-translate-y-0.5 transition-transform"
            style="background: linear-gradient(135deg, #25D366, #128C7E);"
          >
            <span class="material-icons text-4xl">chat</span>
            <div>
              <h3 class="font-semibold text-lg m-0">Chat on WhatsApp</h3>
              <p class="text-sm opacity-90 mt-0.5">Quick replies, easy ordering</p>
            </div>
          </a>

          <!-- Instagram Card -->
          <a
            href="https://www.instagram.com/striratna"
            target="_blank"
            class="flex items-center gap-4 p-5 rounded-xl text-white mb-4 no-underline hover:-translate-y-0.5 transition-transform"
            style="background: linear-gradient(135deg, #833AB4, #E1306C, #F77737);"
          >
            <span class="material-icons text-4xl">camera_alt</span>
            <div>
              <h3 class="font-semibold text-lg m-0">Follow on Instagram</h3>
              <p class="text-sm opacity-90 mt-0.5">&#64;striratna</p>
            </div>
          </a>

          <!-- Business Info -->
          <div class="bg-cream rounded-xl p-6">
            <div class="flex gap-4 mb-5">
              <span class="material-icons text-gold mt-0.5">schedule</span>
              <div>
                <h4 class="text-maroon font-semibold mb-1">Business Hours</h4>
                <p class="text-gray-600 text-sm">Monday - Saturday: 10:00 AM - 8:00 PM</p>
                <p class="text-gray-600 text-sm">Sunday: 11:00 AM - 5:00 PM</p>
              </div>
            </div>
            <div class="flex gap-4 mb-5">
              <span class="material-icons text-gold mt-0.5">location_on</span>
              <div>
                <h4 class="text-maroon font-semibold mb-1">Location</h4>
                <p class="text-gray-600 text-sm">Maharashtra, India</p>
                <p class="text-gray-600 text-sm">Online Store - Delivering All Over India</p>
              </div>
            </div>
            <div class="flex gap-4">
              <span class="material-icons text-gold mt-0.5">phone</span>
              <div>
                <h4 class="text-maroon font-semibold mb-1">Phone</h4>
                <p class="text-gray-600 text-sm">+91 99999 99999</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div>
          <h2 class="text-maroon text-xl font-bold mb-5">Send us a Message</h2>

          <div *ngIf="submitted" class="text-center py-8 bg-cream rounded-xl">
            <span class="material-icons text-5xl text-green-500">check_circle</span>
            <p class="text-gray-800 mt-3 text-lg">Thank you! We'll get back to you shortly.</p>
          </div>

          <form
            *ngIf="!submitted"
            [formGroup]="contactForm"
            (ngSubmit)="onSubmit()"
            class="space-y-4"
          >
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                formControlName="name"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
              />
              <p *ngIf="contactForm.get('name')?.touched && contactForm.get('name')?.hasError('required')" class="text-red-500 text-sm mt-1">Name is required</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                formControlName="phone"
                type="tel"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
              />
              <p *ngIf="contactForm.get('phone')?.touched && contactForm.get('phone')?.hasError('required')" class="text-red-500 text-sm mt-1">Phone is required</p>
              <p *ngIf="contactForm.get('phone')?.touched && contactForm.get('phone')?.hasError('pattern')" class="text-red-500 text-sm mt-1">Enter a valid 10-digit number</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                formControlName="message"
                rows="5"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold resize-vertical"
              ></textarea>
              <p *ngIf="contactForm.get('message')?.touched && contactForm.get('message')?.hasError('required')" class="text-red-500 text-sm mt-1">Message is required</p>
            </div>

            <button
              type="submit"
              [disabled]="contactForm.invalid || sending"
              class="bg-gold text-maroon font-semibold px-8 py-3 rounded-full hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ sending ? 'Sending...' : 'Send Message' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private firestore = inject(Firestore);

  submitted = false;
  sending = false;

  contactForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    message: ['', Validators.required],
  });

  async onSubmit(): Promise<void> {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.sending = true;
    try {
      const inquiriesRef = collection(this.firestore, 'inquiries');
      await addDoc(inquiriesRef, {
        ...this.contactForm.value,
        createdAt: new Date(),
      });
      this.submitted = true;
    } catch (error) {
      console.error('Failed to save inquiry:', error);
      alert('Failed to send message. Please try WhatsApp instead.');
    } finally {
      this.sending = false;
    }
  }
}
