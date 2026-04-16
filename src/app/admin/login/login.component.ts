import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream to-cream-dark px-4">
      <div class="w-full max-w-md bg-white rounded-2xl shadow-xl border-t-4 border-maroon p-8">
        <!-- Brand Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-maroon mb-1">&#x0938;&#x094D;&#x0924;&#x094D;&#x0930;&#x0940;&#x0930;&#x0924;&#x094D;&#x0928;</h1>
          <p class="text-sm text-gray-400 mb-2">Powered by Maaax</p>
          <p class="text-sm font-semibold text-gray-500 uppercase tracking-widest">Admin Panel</p>
        </div>

        <!-- Login Form -->
        <form (ngSubmit)="onLogin()" class="flex flex-col gap-5">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div class="relative">
              <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">email</span>
              <input type="email" [(ngModel)]="email" name="email"
                     placeholder="admin@example.com" required
                     class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon focus:border-maroon transition" />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div class="relative">
              <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">lock</span>
              <input [type]="hidePassword ? 'password' : 'text'"
                     [(ngModel)]="password" name="password" required
                     class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon focus:border-maroon transition" />
              <button type="button" (click)="hidePassword = !hidePassword"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <span class="material-icons text-xl">{{ hidePassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div *ngIf="errorMessage"
               class="flex items-center gap-2 text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <span class="material-icons text-lg">error</span>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Login Button -->
          <button type="submit" [disabled]="isLoading"
                  class="w-full bg-maroon hover:bg-maroon-dark text-white font-semibold py-3 rounded-lg transition disabled:opacity-60 flex items-center justify-center gap-2">
            <svg *ngIf="isLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span *ngIf="!isLoading">Login</span>
            <span *ngIf="isLoading">Logging in...</span>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  hidePassword = true;
  isLoading = false;
  errorMessage = '';

  async onLogin(): Promise<void> {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/admin/dashboard']);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        this.errorMessage = 'Invalid email or password.';
      } else if (err.code === 'auth/too-many-requests') {
        this.errorMessage = 'Too many failed attempts. Please try again later.';
      } else {
        this.errorMessage = 'Login failed. Please try again.';
      }
    } finally {
      this.isLoading = false;
    }
  }
}
