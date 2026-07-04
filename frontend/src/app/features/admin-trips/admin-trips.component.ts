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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { timer, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { TripDialogComponent } from './trip-dialog/trip-dialog.component';
import { ConfirmDialogComponent } from '../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { TripHistoryDialogComponent } from '../trip-history-dialog/trip-history-dialog.component';

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
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './admin-trips.component.html',
  styleUrls: ['./admin-trips.component.css']
})
export class AdminTripsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['vehicleNumber', 'origin', 'destination', 'status', 'driver', 'createdAt', 'actions'];
  dataSource: MatTableDataSource<Trip>;
  private pollingSub?: Subscription;

  filterStatus = '';
  filterDriverId: number | null = null;
  filterDate = '';
  drivers: any[] = [];

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
    this.tripsService.getDrivers().subscribe(drivers => {
      this.drivers = drivers;
    });
    this.loadData();
    // Poll every 5 seconds
    this.pollingSub = timer(5000, 5000).pipe(
      switchMap(() => this.tripsService.getAllTrips(this.filterDriverId))
    ).subscribe({
      next: (trips) => {
        // Update data while keeping sorting/pagination
        this.dataSource.data = trips;
      },
      error: (err) => console.error('Failed to poll trips', err)
    });
  }

  loadData() {
    this.tripsService.getAllTrips(this.filterDriverId).subscribe({
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
    let formattedDate = '';
    if (this.filterDate) {
      const d = new Date(this.filterDate);
      const year = d.getFullYear();
      const month = ('0' + (d.getMonth() + 1)).slice(-2);
      const day = ('0' + d.getDate()).slice(-2);
      formattedDate = `${year}-${month}-${day}`;
    }

    const filterValue = {
      status: this.filterStatus,
      date: formattedDate
    };
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  createFilter(): (data: Trip, filter: string) => boolean {
    return (data: Trip, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);
      
      const matchStatus = !searchTerms.status || data.status === searchTerms.status;
      
      const tripD = new Date(data.createdAt);
      const tYear = tripD.getFullYear();
      const tMonth = ('0' + (tripD.getMonth() + 1)).slice(-2);
      const tDay = ('0' + tripD.getDate()).slice(-2);
      const tripDate = `${tYear}-${tMonth}-${tDay}`;
      
      const matchDate = !searchTerms.date || tripDate === searchTerms.date;

      return matchStatus && matchDate;
    };
  }

  onDriverFilterChange() {
    this.loadData();
  }

  clearFilters() {
    this.filterStatus = '';
    this.filterDate = '';
    if (this.filterDriverId !== null) {
      this.filterDriverId = null;
      this.loadData();
    }
    this.applyFilter();
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

  cancelTrip(trip: Trip) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Cancel Trip',
        message: `Are you sure you want to cancel this trip? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tripsService.updateTrip(trip.id, { status: 'CANCELLED' }).subscribe({
          next: () => {
            this.snackBar.open('Trip cancelled successfully', 'Close', { duration: 3000 });
            this.loadData();
          },
          error: (err) => {
            this.snackBar.open('Failed to cancel trip', 'Close', { duration: 3000, panelClass: 'error-snackbar' });
          }
        });
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
