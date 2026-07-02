import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // Admin module lazy load placeholder
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ADMIN' },
    loadComponent: () => import('./features/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  // Driver module lazy load placeholder
  {
    path: 'driver',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'DRIVER' },
    loadComponent: () => import('./features/driver-dashboard/driver-dashboard.component').then(m => m.DriverDashboardComponent)
  },
  { path: '**', redirectTo: '/login' }
];
