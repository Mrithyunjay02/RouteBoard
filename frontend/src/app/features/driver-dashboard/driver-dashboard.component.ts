import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardStats } from '../../core/services/dashboard.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { timer, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './driver-dashboard.component.html',
  styleUrls: ['./driver-dashboard.component.css']
})
export class DriverDashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStats | null = null;
  isLoading = true;
  hasError = false;
  private pollingSub?: Subscription;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    // Poll every 5 seconds
    this.pollingSub = timer(0, 5000).pipe(
      switchMap(() => this.dashboardService.getStats())
    ).subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
        this.hasError = false;
      },
      error: (err) => {
        console.error('Failed to load driver dashboard stats', err);
        this.isLoading = false;
        this.hasError = true;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
    }
  }
}
