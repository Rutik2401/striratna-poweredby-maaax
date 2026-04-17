import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.anonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: localStorage,
          storageKey: 'sb-striratna-auth',
          flowType: 'pkce',
          // Supabase-js defaults to a Web Locks-API lock that times out in 10s
          // when another tab / the same tab re-registers. For a single-tab admin
          // panel this produces spurious NavigatorLockAcquireTimeoutError logs
          // and can briefly drop the session on refresh. Use a no-op lock.
          lock: async <R,>(_name: string, _timeout: number, fn: () => Promise<R>) => fn(),
        },
      }
    );
  }

  get client(): SupabaseClient {
    return this.supabase;
  }
}
