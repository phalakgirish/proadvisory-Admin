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
  selector: 'app-edit-area',
  imports: [PageHeaderComponent,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
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
  templateUrl: './edit-area.component.html',
  styleUrl: './edit-area.component.scss'
})
export class EditAreaComponent implements OnInit {
  areaForm!: FormGroup;
  areaData: any;  // This will hold the area data passed for editing

  cityOptions = ['New York', 'Los Angeles', 'Chicago'];  // You should use actual city options here
  statusOptions = [
    { value: 'active', viewValue: 'Active' },
    { value: 'inactive', viewValue: 'Inactive' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the 'id' parameter from the route (this could be a name or id of the area)
    const areaId = this.route.snapshot.paramMap.get('id');

    // Simulate fetching data for the area with the given id
    // In a real scenario, you would call a service to fetch data from an API
    this.loadAreaData(areaId);

    // Initialize the form with the existing data
    this.createForm();
  }

  loadAreaData(id: string | null): void {
    // Simulated data (replace this with an actual API call to fetch area details)
    const dummyData = [
      { id: '1', cname: 'New York', aname: 'Downtown', pincode: '10001', status: 'active' },
      { id: '2', cname: 'Los Angeles', aname: 'Hollywood', pincode: '90001', status: 'inactive' },
    ];
    
    this.areaData = dummyData.find(area => area.id === id);
  }

  createForm(): void {
    // Initialize the form with the existing area data
    this.areaForm = this.fb.group({
      cname: [this.areaData?.cname, [Validators.required]],
      aname: [this.areaData?.aname, [Validators.required]],
      pincode: [this.areaData?.pincode, [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      status: [this.areaData?.status, [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.areaForm.valid) {
      // Here, you would send the updated data to your API to save the changes
      const updatedArea = this.areaForm.value;
      console.log('Updated Area:', updatedArea);
      
      // Redirect to another page, for example back to a list or show a success message
      this.router.navigate(['/areas']);  // Change the redirect URL as per your needs
    }
  }
}