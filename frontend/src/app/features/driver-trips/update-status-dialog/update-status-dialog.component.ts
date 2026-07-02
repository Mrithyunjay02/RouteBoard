import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TripsService } from '../../../../core/services/trips.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-status-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './update-status-dialog.component.html',
  styleUrls: ['./update-status-dialog.component.css']
})
export class UpdateStatusDialogComponent {
  statusForm: FormGroup;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private tripsService: TripsService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UpdateStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tripId: number; currentStatus: string }
  ) {
    this.statusForm = this.fb.group({
      status: [data.currentStatus, Validators.required]
    });
  }

  onSave(): void {
    if (this.statusForm.invalid) return;

    this.isSaving = true;
    const newStatus = this.statusForm.value.status;

    this.tripsService.updateTrip(this.data.tripId, { status: newStatus }).subscribe({
      next: () => {
        this.snackBar.open('Status updated successfully', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('Failed to update status', 'Close', { duration: 3000, panelClass: 'error-snackbar' });
        this.isSaving = false;
      }
    });
  }
}
