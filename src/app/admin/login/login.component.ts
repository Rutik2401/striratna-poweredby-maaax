import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-cream flex items-center justify-center px-4">
      <div class="w-full max-w-md">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold to-gold-dark
                      flex items-center justify-center">
            <span class="text-white font-heading font-bold text-2xl">स्त्री</span>
          </div>
          <h1 class="font-heading text-2xl font-bold text-maroon">Admin Panel</h1>
          <p class="text-sm text-gray-500 mt-1">स्त्रीरत्न - Powered by Maaax</p>
        </div>

        <!-- Form -->
        <div class="bg-white rounded-2xl p-8 shadow-sm">
          <form (ngSubmit)="login()" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" [(ngModel)]="email" name="email" required
                class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                placeholder="admin@striratna.in" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" [(ngModel)]="password" name="password" required
                class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                placeholder="Enter your password" />
            </div>

            @if (error()) {
              <div class="p-3 bg-red-50 text-red-600 text-sm rounded-xl">
                {{ error() }}
              </div>
            }

            <button type="submit" [disabled]="loading()"
              class="w-full px-6 py-4 bg-gradient-to-r from-maroon to-maroon-dark text-white
                     font-semibold rounded-full shadow-lg disabled:opacity-50 transition-all active:scale-95">
              {{ loading() ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  async login(): Promise<void> {
    if (!this.email || !this.password) return;

    this.loading.set(true);
    this.error.set('');

    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/admin/dashboard']);
    } catch (err: any) {
      this.error.set('Invalid email or password. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }
}
