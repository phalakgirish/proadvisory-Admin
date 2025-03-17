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
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-edit-property-subtype',
  imports: [CommonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule, PageHeaderComponent],
  templateUrl: './edit-property-subtype.component.html',
  styleUrl: './edit-property-subtype.component.scss'
})
export class EditPropertySubtypeComponent implements OnInit {
  propertyForm!: FormGroup;
  propertyTypeOptions = [
    { value: 'residential', viewValue: 'Residential' },
    { value: 'commercial', viewValue: 'Commercial' }
  ];  // Example Property Types
  statusOptions = [
    { value: 'active', viewValue: 'Active' },
    { value: 'inactive', viewValue: 'Inactive' }
  ];  // Example Status Options
  propertySubtypeData: any;  // This will hold the property subtype data passed for editing

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the 'id' parameter from the route (the property subtype ID)
    const subtypeId = this.route.snapshot.paramMap.get('id');
    
    // Simulate fetching data for the property subtype with the given id
    this.loadPropertySubtypeData(subtypeId);

    // Initialize the form with existing data
    this.createForm();
  }

  loadPropertySubtypeData(id: string | null): void {
    // Simulate fetching the property subtype data (replace with actual API service call)
    const dummyData = [
      { id: '1', propertyType: 'residential', pstname: 'Villa', status: 'active' },
      { id: '2', propertyType: 'commercial', pstname: 'Office', status: 'inactive' }
    ];

    // Find the property subtype by ID
    this.propertySubtypeData = dummyData.find(item => item.id === id);
  }

  createForm(): void {
    // Initialize the form with the existing property subtype data
    this.propertyForm = this.fb.group({
      propertyType: [this.propertySubtypeData?.propertyType, [Validators.required]],
      pstname: [this.propertySubtypeData?.pstname, [Validators.required]],
      status: [this.propertySubtypeData?.status, [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.propertyForm.valid) {
      // Update the property subtype data (send it to your API)
      const updatedPropertySubtype = this.propertyForm.value;
      console.log('Updated Property Subtype:', updatedPropertySubtype);

      // After submitting the form, navigate to another page (e.g., property subtype list)
      this.router.navigate(['/property-subtype-list']);
    }
  }
}