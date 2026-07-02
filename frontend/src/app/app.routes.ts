import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'admin', pathMatch: 'full' },
      {
        path: 'admin',
        canActivate: [RoleGuard],
        data: { role: 'ADMIN' },
        loadComponent: () => import('./features/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'admin/trips',
        canActivate: [RoleGuard],
        data: { role: 'ADMIN' },
        loadComponent: () => import('./features/admin-trips/admin-trips.component').then(m => m.AdminTripsComponent)
      },
      {
        path: 'driver',
        canActivate: [RoleGuard],
        data: { role: 'DRIVER' },
        loadComponent: () => import('./features/driver-dashboard/driver-dashboard.component').then(m => m.DriverDashboardComponent)
      },
      {
        path: 'driver/trips',
        canActivate: [RoleGuard],
        data: { role: 'DRIVER' },
        loadComponent: () => import('./features/driver-trips/driver-trips.component').then(m => m.DriverTripsComponent)
      }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
