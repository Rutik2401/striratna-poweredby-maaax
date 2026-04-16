import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { WhatsappFabComponent } from './shared/components/whatsapp-fab/whatsapp-fab.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, WhatsappFabComponent],
  template: `
    <app-navbar></app-navbar>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
    <app-whatsapp-fab></app-whatsapp-fab>
  `,
  styles: [`
    main {
      min-height: calc(100vh - 140px);
    }
  `]
})
export class AppComponent {
  title = 'स्त्रीरत्न - Powered by Maaax';
}
