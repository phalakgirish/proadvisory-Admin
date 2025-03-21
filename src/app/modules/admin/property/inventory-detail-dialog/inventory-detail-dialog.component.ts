import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule

interface Inventory {
  propertyArea: string;
  carpetArea: number;
  minPrice: number;
  maxPrice: number;
  uploadFile: string;
  builtUpArea: string;
  inventoryName: string;
  id?: number;
  propertyName: string;
}

@Component({
  selector: 'app-inventory-detail-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule], // Add MatDialogModule and MatButtonModule
  templateUrl: './inventory-detail-dialog.component.html',
  styleUrl: './inventory-detail-dialog.component.scss'
})
export class InventoryDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<InventoryDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { propertyName: string; inventories: Inventory[] }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}