import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import {
  MAT_DATE_LOCALE,
  MatOptionModule,
  MatRippleModule,
} from '@angular/material/core';
import { MatMenuTrigger, MatMenuModule } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { TableExportUtil, LocalStorageService, rowsAnimation } from '@shared';
import { NgClass, DatePipe, CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { Routes, ActivatedRoute, Router } from '@angular/router';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';


@Component({
  imports: [PageHeaderComponent,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FileUploadComponent,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatOptionModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatPaginatorModule],
  templateUrl: './edit-amenity.component.html',
  styleUrl: './edit-amenity.component.scss'
})
export class EditAmenityComponent implements OnInit {
  amenityForm!: FormGroup;
  amenityData: any;
  statusOptions = [
    { value: 'active', viewValue: 'Active' },
    { value: 'inactive', viewValue: 'Inactive' }
  ];


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // This is a mock method to simulate loading data (you can replace it later with an API call)
    const amenityId = +this.route.snapshot.paramMap.get('id')!; // Get the amenity ID from the route
    this.loadAmenityData(amenityId); // Load data for editing

    // Initialize form
    this.amenityForm = this.fb.group({
      amenityName: [this.amenityData?.amenityName, Validators.required],
      status: [this.amenityData?.status, Validators.required],
      uploadFile: [this.amenityData?.uploadFile] // This is for file upload
    });
  }

  loadAmenityData(id: number): void {
    // Mock amenity data for editing (Replace this with actual data fetching logic)
    this.amenityData = {
      id: id,
      amenityName: 'Swimming Pool',
      status: 'active',
      uploadFile: null
    };
  }

  onSubmit(): void {
    if (this.amenityForm.valid) {
      const updatedAmenity = this.amenityForm.value;
      console.log('Amenity updated:', updatedAmenity);
      // Later, you'll send this updated data to the backend to save it
    }
  }

  onCancel(): void {
    this.router.navigate(['/amenities']); // Redirect to the amenities list or the previous page
  }
}