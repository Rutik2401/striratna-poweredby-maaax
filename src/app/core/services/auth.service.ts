import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  user,
  User
} from '@angular/fire/auth';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);

  readonly user$: Observable<User | null> = user(this.auth);
  readonly isLoggedIn$: Observable<boolean> = this.user$.pipe(map(u => !!u));

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
}
