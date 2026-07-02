import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const expectedRole = route.data['role'];
    if (this.authService.isAuthenticated() && this.authService.hasRole(expectedRole)) {
      return true;
    }
    
    // Redirect based on current role if forbidden
    const currentUser = this.authService.currentUser();
    if (currentUser?.role === 'ADMIN') {
      return this.router.parseUrl('/admin');
    } else if (currentUser?.role === 'DRIVER') {
      return this.router.parseUrl('/driver');
    }
    
    return this.router.parseUrl('/login');
  }
}
