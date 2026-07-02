import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TripsService, Trip } from '../../../../core/services/trips.service';
import { User } from '../../../../core/services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-trip-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './trip-dialog.component.html',
  styleUrls: ['./trip-dialog.component.css']
})
export class TripDialogComponent implements OnInit {
  tripForm: FormGroup;
  isEditMode: boolean;
  drivers: User[] = [];
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private tripsService: TripsService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<TripDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Trip | null
  ) {
    this.isEditMode = !!data;

    this.tripForm = this.fb.group({
      vehicleNumber: [data?.vehicleNumber || '', Validators.required],
      origin: [data?.origin || '', Validators.required],
      destination: [data?.destination || '', Validators.required],
      status: [data?.status || 'SCHEDULED', Validators.required],
      driverId: [data?.driverId || null]
    });
  }

  ngOnInit(): void {
    this.tripsService.getDrivers().subscribe({
      next: (drivers) => this.drivers = drivers,
      error: (err) => console.error('Failed to load drivers', err)
    });
  }

  onSave(): void {
    if (this.tripForm.invalid) return;

    this.isSaving = true;
    const formValue = this.tripForm.value;

    if (this.isEditMode && this.data) {
      this.tripsService.updateTrip(this.data.id, formValue).subscribe({
        next: () => {
          this.snackBar.open('Trip updated successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: () => {
          this.snackBar.open('Failed to update trip', 'Close', { duration: 3000, panelClass: 'error-snackbar' });
          this.isSaving = false;
        }
      });
    } else {
      this.tripsService.createTrip(formValue).subscribe({
        next: () => {
          this.snackBar.open('Trip created successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: () => {
          this.snackBar.open('Failed to create trip', 'Close', { duration: 3000, panelClass: 'error-snackbar' });
          this.isSaving = false;
        }
      });
    }
  }
}
