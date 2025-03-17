import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-image-preview-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './image-preview-dialog.component.html',
  styleUrl: './image-preview-dialog.component.scss',
})
export class ImagePreviewDialogComponent {
  imageLoadError = false; // Track image loading errors

  constructor(@Inject(MAT_DIALOG_DATA) public data: { imageUrl: string }) {}

  onImageError(): void {
    this.imageLoadError = true; // Set error flag if image fails to load
  }
}