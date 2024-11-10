import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent {
  constructor(public dialogRef: MatDialogRef<any>) {}

  onConfirm(): void {
    this.dialogRef.close(true); // Pass "true" to confirm deletion
  }

  onCancel(): void {
    this.dialogRef.close(false); // Pass "false" to cancel
  }
}
