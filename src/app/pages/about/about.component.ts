import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- Hero -->
    <section class="bg-gradient-to-br from-maroon to-maroon-dark text-white py-16 lg:py-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-sm font-semibold text-gold uppercase tracking-wider mb-4">Our Story</p>
        <h1 class="font-heading text-3xl lg:text-5xl font-bold mb-6">
          About <span class="text-gold">स्त्रीरत्न</span>
        </h1>
        <p class="text-lg text-white/80 leading-relaxed">
          From humble beginnings on Instagram to building Maharashtra's most loved art jewellery brand.
        </p>
      </div>
    </section>

    <!-- Story -->
    <section class="py-16 lg:py-20">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="space-y-12">
          <!-- The Problem -->
          <div class="bg-white rounded-2xl p-8 shadow-sm">
            <h2 class="font-heading text-2xl font-bold text-maroon mb-4">The Challenge</h2>
            <p class="text-gray-600 leading-relaxed mb-4">
              It all started on Instagram. What began as a small page sharing beautiful jewellery designs
              quickly grew into something we never imagined. Within months, we were receiving
              <span class="font-semibold text-maroon">1000+ messages every single day</span>.
            </p>
            <div class="bg-cream rounded-xl p-6 border-l-4 border-gold">
              <p class="text-gray-700 italic">
                "Amruta, have you read the comments?"<br>
                "There are 1000+ messages pending."<br>
                "We are packing orders but can't reply."<br>
                "Please understand, we will reply to everyone."
              </p>
              <p class="text-sm text-gold font-semibold mt-3">- Actual conversation from our team</p>
            </div>
            <p class="text-gray-600 leading-relaxed mt-4">
              Our small team was overwhelmed. We were losing orders because we couldn't reply fast enough.
              Customers had simple questions - Price? Designs? Delivery? How to order? - but we just
              couldn't keep up.
            </p>
          </div>

          <!-- The Solution -->
          <div class="bg-white rounded-2xl p-8 shadow-sm">
            <h2 class="font-heading text-2xl font-bold text-maroon mb-4">The Solution</h2>
            <p class="text-gray-600 leading-relaxed mb-4">
              That's when we decided to build this platform. Not just a website - but a complete shopping
              experience where you can:
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              @for (feature of features; track feature.title) {
                <div class="flex items-start gap-3 p-4 bg-cream rounded-xl">
                  <div class="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center shrink-0">
                    <span class="text-gold text-lg">{{ feature.icon }}</span>
                  </div>
                  <div>
                    <h3 class="text-sm font-semibold text-gray-900">{{ feature.title }}</h3>
                    <p class="text-xs text-gray-500 mt-0.5">{{ feature.desc }}</p>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Values -->
          <div class="bg-white rounded-2xl p-8 shadow-sm">
            <h2 class="font-heading text-2xl font-bold text-maroon mb-6">What We Stand For</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center">
                <div class="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-gold/20 to-gold/5 rounded-full
                            flex items-center justify-center">
                  <span class="font-heading text-2xl text-gold">1gm</span>
                </div>
                <h3 class="font-heading text-lg font-semibold text-gray-900">Lightweight Luxury</h3>
                <p class="text-sm text-gray-500 mt-1">1gm gold-look jewellery that's comfortable to wear all day</p>
              </div>
              <div class="text-center">
                <div class="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-maroon/20 to-maroon/5 rounded-full
                            flex items-center justify-center">
                  <span class="font-heading text-2xl text-maroon">M</span>
                </div>
                <h3 class="font-heading text-lg font-semibold text-gray-900">Maharashtra Heritage</h3>
                <p class="text-sm text-gray-500 mt-1">Designs inspired by rich Maharashtrian traditions</p>
              </div>
              <div class="text-center">
                <div class="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-full
                            flex items-center justify-center">
                  <span class="text-2xl">&#10084;</span>
                </div>
                <h3 class="font-heading text-lg font-semibold text-gray-900">Affordable Price</h3>
                <p class="text-sm text-gray-500 mt-1">Premium looks without breaking the bank</p>
              </div>
            </div>
          </div>

          <!-- CTA -->
          <div class="text-center">
            <a routerLink="/shop"
               class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-maroon to-maroon-dark
                      text-white font-semibold rounded-full shadow-lg shadow-maroon/25
                      hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
              Explore Our Collection
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class AboutComponent {
  features = [
    { icon: '🔍', title: 'Browse Anytime', desc: 'No waiting for replies, explore at your pace' },
    { icon: '💰', title: 'See Prices Instantly', desc: 'All prices clearly displayed' },
    { icon: '🛒', title: 'Order in Seconds', desc: 'Add to cart and checkout seamlessly' },
    { icon: '📱', title: 'WhatsApp Confirmation', desc: 'Order confirmation directly on WhatsApp' },
  ];
}
