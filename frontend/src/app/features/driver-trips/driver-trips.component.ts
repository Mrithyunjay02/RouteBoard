import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripsService, Trip } from '../../core/services/trips.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { timer, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UpdateStatusDialogComponent } from './update-status-dialog/update-status-dialog.component';
import { TripHistoryDialogComponent } from '../trip-history-dialog/trip-history-dialog.component';

@Component({
  selector: 'app-driver-trips',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './driver-trips.component.html',
  styleUrls: ['./driver-trips.component.css']
})
export class DriverTripsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['vehicleNumber', 'origin', 'destination', 'status', 'createdAt', 'actions'];
  dataSource: MatTableDataSource<Trip>;
  private pollingSub?: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private tripsService: TripsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Trip>();
  }

  ngOnInit() {
    this.loadData();
    // Poll every 5 seconds
    this.pollingSub = timer(5000, 5000).pipe(
      switchMap(() => this.tripsService.getDriverTrips())
    ).subscribe({
      next: (trips) => {
        this.dataSource.data = trips;
      },
      error: (err) => console.error('Failed to poll driver trips', err)
    });
  }

  loadData() {
    this.tripsService.getDriverTrips().subscribe({
      next: (trips) => {
        this.dataSource.data = trips;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        this.snackBar.open('Failed to load your trips', 'Close', { duration: 3000 });
      }
    });
  }

  ngOnDestroy() {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
    }
  }

  openUpdateStatusDialog(trip: Trip) {
    const dialogRef = this.dialog.open(UpdateStatusDialogComponent, {
      width: '400px',
      data: { tripId: trip.id, currentStatus: trip.status }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  viewHistory(trip: Trip) {
    this.dialog.open(TripHistoryDialogComponent, {
      width: '600px',
      data: { tripId: trip.id, vehicleNumber: trip.vehicleNumber }
    });
  }
}
