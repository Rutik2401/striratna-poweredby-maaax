import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-gradient-to-br from-maroon to-[#4a0012] text-cream pt-12 pb-6 px-6">
      <div class="max-w-[1200px] mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1.5fr] gap-10">
          <!-- Brand Section -->
          <div>
            <h2 class="font-['Playfair_Display',serif] text-[2rem] font-bold text-gold m-0 mb-2">स्त्रीरत्न</h2>
            <p class="font-['Playfair_Display',serif] text-base text-rose-gold italic m-0 mb-3">Adorn Yourself with Elegance</p>
            <p class="text-sm text-cream/70 leading-relaxed m-0">
              Handcrafted jewelry that celebrates the beauty of Indian tradition.
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="font-['Playfair_Display',serif] text-lg text-gold m-0 mb-4 pb-2 border-b border-gold/30">Quick Links</h3>
            <ul class="list-none m-0 p-0 flex flex-col gap-2">
              <li><a routerLink="/" class="text-cream/80 no-underline text-[0.925rem] transition-all duration-200 hover:text-gold hover:pl-1">Home</a></li>
              <li><a routerLink="/shop" class="text-cream/80 no-underline text-[0.925rem] transition-all duration-200 hover:text-gold hover:pl-1">Shop</a></li>
              <li><a routerLink="/about" class="text-cream/80 no-underline text-[0.925rem] transition-all duration-200 hover:text-gold hover:pl-1">About</a></li>
              <li><a routerLink="/contact" class="text-cream/80 no-underline text-[0.925rem] transition-all duration-200 hover:text-gold hover:pl-1">Contact</a></li>
            </ul>
          </div>

          <!-- Contact Section -->
          <div>
            <h3 class="font-['Playfair_Display',serif] text-lg text-gold m-0 mb-4 pb-2 border-b border-gold/30">Get in Touch</h3>
            <ul class="list-none m-0 p-0 flex flex-col gap-2">
              <li>
                <a href="https://wa.me/919XXXXXXXXX"
                   target="_blank"
                   rel="noopener noreferrer"
                   class="text-cream/80 no-underline text-[0.925rem] transition-all duration-200 hover:text-gold hover:pl-1 flex items-center gap-2">
                  <svg class="shrink-0" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="https://instagram.com/striratna_poweredby_maaax"
                   target="_blank"
                   rel="noopener noreferrer"
                   class="text-cream/80 no-underline text-[0.925rem] transition-all duration-200 hover:text-gold hover:pl-1 flex items-center gap-2">
                  <span class="material-icons text-[18px]">photo_camera</span>
                  &#64;striratna_poweredby_maaax
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="mt-10 pt-5 border-t border-gold/20 flex flex-col md:flex-row justify-between items-center gap-2">
          <p class="text-sm text-cream/60 m-0">
            &copy; 2026 स्त्रीरत्न. All rights reserved.
          </p>
          <p class="text-sm text-cream/60 m-0">
            Powered by <span class="text-gold font-semibold">Maaax</span>
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [`:host { display: block; }`],
})
export class FooterComponent {}
