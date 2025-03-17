import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ImagePreviewDialogComponent } from '../image-preview-dialog/image-preview-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-property-type',
  imports: [ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatCheckboxModule, PageHeaderComponent],
  templateUrl: './edit-property-type.component.html',
  styleUrl: './edit-property-type.component.scss'
})
export class EditPropertyTypeComponent implements OnInit {
  propertyForm!: FormGroup;
  statusOptions = [
    { value: 'active', viewValue: 'Active' },
    { value: 'inactive', viewValue: 'Inactive' }
  ];  // Example Status Options
  propertyTypeData: any;  // This will hold the property type data passed for editing

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the 'id' parameter from the route (the property type ID)
    const typeId = this.route.snapshot.paramMap.get('id');
    
    // Simulate fetching data for the property type with the given id
    this.loadPropertyTypeData(typeId);

    // Initialize the form with existing data
    this.createForm();
  }

  loadPropertyTypeData(id: string | null): void {
    // Simulate fetching the property type data (replace with actual API service call)
    const dummyData = [
      { id: '1', ptname: 'Residential', status: 'active' },
      { id: '2', ptname: 'Commercial', status: 'inactive' }
    ];

    // Find the property type by ID
    this.propertyTypeData = dummyData.find(item => item.id === id);
  }

  createForm(): void {
    // Initialize the form with the existing property type data
    this.propertyForm = this.fb.group({
      ptname: [this.propertyTypeData?.ptname, [Validators.required]],
      status: [this.propertyTypeData?.status, [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.propertyForm.valid) {
      // Update the property type data (send it to your API)
      const updatedPropertyType = this.propertyForm.value;
      console.log('Updated Property Type:', updatedPropertyType);

      // After submitting the form, navigate to another page (e.g., property type list)
      this.router.navigate(['/property-type-list']);
    }
  }
}