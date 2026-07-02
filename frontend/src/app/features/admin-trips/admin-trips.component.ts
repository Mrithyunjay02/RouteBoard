import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripsService, Trip } from '../../core/services/trips.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { timer, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { TripDialogComponent } from './trip-dialog/trip-dialog.component';
import { ConfirmDialogComponent } from '../../shared/dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-trips',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule
  ],
  templateUrl: './admin-trips.component.html',
  styleUrls: ['./admin-trips.component.css']
})
export class AdminTripsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['vehicleNumber', 'origin', 'destination', 'status', 'driver', 'createdAt', 'actions'];
  dataSource: MatTableDataSource<Trip>;
  private pollingSub?: Subscription;

  filterStatus = '';
  filterDriver = '';
  filterDate = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private tripsService: TripsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Trip>();
    this.dataSource.filterPredicate = this.createFilter();
  }

  ngOnInit() {
    this.loadData();
    // Poll every 5 seconds
    this.pollingSub = timer(5000, 5000).pipe(
      switchMap(() => this.tripsService.getAllTrips())
    ).subscribe({
      next: (trips) => {
        // Update data while keeping sorting/pagination
        this.dataSource.data = trips;
      },
      error: (err) => console.error('Failed to poll trips', err)
    });
  }

  loadData() {
    this.tripsService.getAllTrips().subscribe({
      next: (trips) => {
        this.dataSource.data = trips;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        this.snackBar.open('Failed to load trips', 'Close', { duration: 3000 });
      }
    });
  }

  ngOnDestroy() {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
    }
  }

  applyFilter() {
    const filterValue = {
      status: this.filterStatus,
      driver: this.filterDriver,
      date: this.filterDate
    };
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  createFilter(): (data: Trip, filter: string) => boolean {
    return (data: Trip, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);
      
      const matchStatus = !searchTerms.status || data.status === searchTerms.status;
      
      const driverName = data.driver?.name?.toLowerCase() || '';
      const matchDriver = !searchTerms.driver || driverName.includes(searchTerms.driver.toLowerCase());
      
      const tripDate = new Date(data.createdAt).toISOString().split('T')[0];
      const matchDate = !searchTerms.date || tripDate === searchTerms.date;

      return matchStatus && matchDriver && matchDate;
    };
  }

  openTripDialog(trip?: Trip) {
    const dialogRef = this.dialog.open(TripDialogComponent, {
      width: '500px',
      data: trip ? { ...trip } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  deleteTrip(trip: Trip) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Trip',
        message: `Are you sure you want to delete trip ${trip.vehicleNumber}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tripsService.deleteTrip(trip.id).subscribe({
          next: () => {
            this.snackBar.open('Trip deleted successfully', 'Close', { duration: 3000 });
            this.loadData();
          },
          error: (err) => {
            this.snackBar.open('Failed to delete trip', 'Close', { duration: 3000, panelClass: 'error-snackbar' });
          }
        });
      }
    });
  }
}
