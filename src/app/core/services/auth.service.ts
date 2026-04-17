import { Injectable, inject, signal, computed } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { User } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabaseService = inject(SupabaseService);
  private supabase = this.supabaseService.client;

  private currentUser = signal<User | null>(null);
  readonly isLoggedIn = computed(() => !!this.currentUser());
  readonly user = this.currentUser.asReadonly();

  constructor() {
    this.supabase.auth.getUser().then(({ data }) => {
      this.currentUser.set(data.user);
    });

    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.currentUser.set(session?.user ?? null);
    });
  }

  async login(email: string, password: string): Promise<void> {
    const { error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }

  async logout(): Promise<void> {
    await this.supabase.auth.signOut();
  }
}
