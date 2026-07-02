import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'DRIVER';
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/auth';
  
  currentUser = signal<User | null>(null);
  
  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.currentUser.set(res.user);
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.role === role;
  }

  private loadUserFromStorage() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        this.currentUser.set(JSON.parse(userStr));
      } catch (e) {
        this.logout();
      }
    }
  }
}
