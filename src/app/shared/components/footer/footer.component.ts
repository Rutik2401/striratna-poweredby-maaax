import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-maroon text-white">
      <!-- Main Footer -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <!-- Brand -->
          <div class="lg:col-span-1">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                <span class="text-white font-heading font-bold text-xl">स्त्री</span>
              </div>
              <div>
                <h3 class="font-heading text-2xl font-bold text-gold">स्त्रीरत्न</h3>
                <p class="text-xs text-white/60">POWERED BY MAAAX</p>
              </div>
            </div>
            <p class="text-white/70 text-sm leading-relaxed mb-4">
              साज महाराष्ट्राचा - Premium 1gm Art Jewellery. Luxury look, affordable price.
              Handcrafted with love from Pune.
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="font-heading text-lg font-semibold text-gold mb-4">Quick Links</h4>
            <ul class="space-y-2">
              <li><a routerLink="/" class="text-sm text-white/70 hover:text-gold transition-colors">Home</a></li>
              <li><a routerLink="/shop" class="text-sm text-white/70 hover:text-gold transition-colors">Shop</a></li>
              <li><a routerLink="/about" class="text-sm text-white/70 hover:text-gold transition-colors">About Us</a></li>
              <li><a routerLink="/contact" class="text-sm text-white/70 hover:text-gold transition-colors">Contact</a></li>
            </ul>
          </div>

          <!-- Policies -->
          <div>
            <h4 class="font-heading text-lg font-semibold text-gold mb-4">Policies</h4>
            <ul class="space-y-2">
              <li><span class="text-sm text-white/70">Free Delivery on orders above ₹999</span></li>
              <li><span class="text-sm text-white/70">Easy Returns within 7 days</span></li>
              <li><span class="text-sm text-white/70">Cash on Delivery available</span></li>
              <li><span class="text-sm text-white/70">100% Secure Checkout</span></li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="font-heading text-lg font-semibold text-gold mb-4">Get in Touch</h4>
            <ul class="space-y-3">
              <li class="flex items-start gap-2">
                <svg class="w-5 h-5 text-gold mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="text-sm text-white/70">Pune, Maharashtra</span>
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-5 h-5 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span class="text-sm text-white/70">contact&#64;striratna.in</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-white/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p class="text-xs text-white/50">
              &copy; 2024 स्त्रीरत्न - Powered by Maaax. All rights reserved.
            </p>
            <p class="text-xs text-white/50">
              Made with love in Pune, Maharashtra
            </p>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
