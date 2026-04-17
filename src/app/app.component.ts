import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { WhatsappFabComponent } from './shared/components/whatsapp-fab/whatsapp-fab.component';
import { ToastContainerComponent } from './shared/components/toast/toast-container.component';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    WhatsappFabComponent,
    ToastContainerComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'स्त्रीरत्न - Powered by Maaax';
  isAdminRoute = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e) => (e as NavigationEnd).url)
      )
      .subscribe((url) => {
        this.isAdminRoute = url.startsWith('/admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }
}
