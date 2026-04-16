import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero -->
    <section
      class="w-full min-h-[40vh] bg-maroon bg-cover bg-center relative"
      style="background-image: url('/assets/images/about-bg.jpg');"
    >
      <div
        class="min-h-[40vh] flex flex-col items-center justify-center text-cream text-center p-8"
        style="background: linear-gradient(135deg, rgba(128,0,32,0.85), rgba(183,110,121,0.7));"
      >
        <h1 class="text-4xl md:text-5xl font-bold mb-2" style="text-shadow: 2px 2px 8px rgba(0,0,0,0.3);">
          &#x0938;&#x094D;&#x0924;&#x094D;&#x0930;&#x0940;&#x0930;&#x0924;&#x094D;&#x0928;
        </h1>
        <p class="text-sm tracking-[3px] uppercase opacity-90">Powered by Maaax</p>
      </div>
    </section>

    <!-- Brand Story -->
    <section class="py-12 px-4 md:px-6 max-w-[1000px] mx-auto">
      <h2 class="text-center text-2xl md:text-3xl font-bold text-maroon mb-2">Our Story</h2>
      <div class="w-[60px] h-[3px] bg-gold mx-auto mb-6"></div>
      <div class="max-w-[700px] mx-auto leading-relaxed text-gray-600 space-y-4">
        <p>
          <strong class="text-maroon">&#x0938;&#x094D;&#x0924;&#x094D;&#x0930;&#x0940;&#x0930;&#x0924;&#x094D;&#x0928;</strong> was born from a simple belief:
          every woman deserves to feel beautiful without breaking the bank. Our name, meaning
          <em class="text-rose-gold">"Jewel of Women"</em>, reflects our commitment to celebrating the innate beauty
          and strength of women through exquisite, affordable jewelry.
        </p>
        <p>
          What started as a small passion project has grown into a trusted brand loved by
          thousands of women across India. We carefully curate each piece, ensuring it meets
          our high standards of quality, design, and affordability.
        </p>
        <p>
          From traditional Maharashtrian designs to modern contemporary pieces, our collection
          is as diverse as the women who wear them. Every order is packaged with love and care,
          delivered right to your doorstep.
        </p>
      </div>
    </section>

    <!-- Mission -->
    <section class="mx-4 md:mx-6 max-w-[1000px] lg:mx-auto">
      <div class="bg-cream rounded-2xl text-center py-12 px-8">
        <span class="material-icons text-gold text-5xl">auto_awesome</span>
        <h2 class="text-maroon text-2xl font-bold mt-4 mb-2">Our Mission</h2>
        <p class="text-gray-600 text-lg">Making premium jewelry accessible to every woman</p>
      </div>
    </section>

    <!-- Values -->
    <section class="py-12 px-4 md:px-6 max-w-[1000px] mx-auto">
      <h2 class="text-center text-2xl md:text-3xl font-bold text-maroon mb-2">Our Values</h2>
      <div class="w-[60px] h-[3px] bg-gold mx-auto mb-8"></div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          class="text-center py-8 px-4 bg-white rounded-xl shadow-md border-t-4 border-gold"
          *ngFor="let value of values"
        >
          <span class="material-icons text-gold text-4xl">{{ value.icon }}</span>
          <h3 class="text-maroon font-semibold mt-3 mb-2">{{ value.title }}</h3>
          <p class="text-gray-500 text-sm">{{ value.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section
      class="mx-4 md:mx-6 max-w-[1000px] lg:mx-auto rounded-2xl py-12 px-6"
      style="background: linear-gradient(135deg, #800020, #B76E79);"
    >
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-cream">
        <div *ngFor="let stat of stats">
          <h3 class="text-2xl md:text-3xl font-bold text-gold mb-1">{{ stat.number }}</h3>
          <p class="text-sm opacity-90">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- Instagram CTA -->
    <section class="py-12 px-4 text-center max-w-[1000px] mx-auto">
      <span class="material-icons text-rose-gold text-5xl">camera_alt</span>
      <h2 class="text-maroon text-2xl font-bold mt-3 mb-2">Follow Our Journey</h2>
      <p class="text-gray-500 mb-6">See our latest designs, styling tips, and customer looks on Instagram</p>
      <a
        href="https://www.instagram.com/striratna"
        target="_blank"
        class="inline-block text-white font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
        style="background: linear-gradient(135deg, #833AB4, #E1306C, #F77737);"
      >
        Follow &#64;striratna
      </a>
    </section>
  `,
  styles: [`
    :host { display: block; }
  `],
})
export class AboutComponent {
  values = [
    {
      icon: 'diamond',
      title: 'Quality',
      desc: 'Every piece undergoes strict quality checks. We use only premium materials that last.',
    },
    {
      icon: 'handshake',
      title: 'Trust',
      desc: 'Transparent pricing, honest descriptions, and genuine customer service you can rely on.',
    },
    {
      icon: 'savings',
      title: 'Affordability',
      desc: 'Premium designs at prices that make jewelry accessible to every woman in India.',
    },
  ];

  stats = [
    { number: '5,000+', label: 'Happy Customers' },
    { number: '500+', label: 'Unique Designs' },
    { number: '50+', label: 'Categories' },
    { number: '4.8/5', label: 'Customer Rating' },
  ];
}
