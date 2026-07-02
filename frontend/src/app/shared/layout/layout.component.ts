import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  authService = inject(AuthService);
  
  menuItems = this.authService.hasRole('ADMIN') ? [
    { label: 'Dashboard', icon: 'dashboard', path: '/admin' },
    { label: 'Trips', icon: 'directions_car', path: '/admin/trips' }
  ] : [
    { label: 'My Dashboard', icon: 'dashboard', path: '/driver' },
    { label: 'My Trips', icon: 'directions_car', path: '/driver/trips' }
  ];

  logout() {
    this.authService.logout();
  }
}
