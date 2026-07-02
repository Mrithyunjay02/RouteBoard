import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TripsService, TripHistory } from '../../core/services/trips.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-trip-history-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './trip-history-dialog.component.html',
  styleUrls: ['./trip-history-dialog.component.css']
})
export class TripHistoryDialogComponent implements OnInit {
  history: TripHistory[] = [];
  isLoading = true;

  constructor(
    private tripsService: TripsService,
    public dialogRef: MatDialogRef<TripHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tripId: number; vehicleNumber: string }
  ) {}

  ngOnInit(): void {
    this.tripsService.getTripHistory(this.data.tripId).subscribe({
      next: (history: TripHistory[]) => {
        this.history = history;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Failed to load history', err);
        this.isLoading = false;
      }
    });
  }
}
