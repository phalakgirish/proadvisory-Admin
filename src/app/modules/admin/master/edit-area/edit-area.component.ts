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
import { CurdService } from 'app/services/curd.service';

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
  areaId!: string;
  cityOptions: any;
  isEditMode = false; 
  statusOptions = [
    { value: 'Active', viewValue: 'Active' },
    { value: 'Inactive', viewValue: 'Inactive' },
  ];
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private curdService: CurdService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.fetchCities();

    // ✅ Fetch query params and patch values
    this.route.queryParams.subscribe((params) => {
      if (params['_id']) {
        this.areaId = params['_id'];
        this.patchForm(params);
      }
    });
  }

  createForm(): void {
    this.areaForm = this.fb.group({
      cname: ['', Validators.required],
      aname: [ '',
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s]*$/)]
      ],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      status: ['', Validators.required],
    });
  }

  fetchCities(): void {
    this.curdService.getData('city').subscribe({
      next: (city) => {
        this.cityOptions = city;
      },
      error: () => {
        this.showSnackBar('Failed to load cities.');
      },
    });
  }

  patchForm(data: any): void {
    this.areaForm.patchValue({
      cname: data.cname,
      aname: data.aname,
      pincode: data.pincode,
      status: data.status,
    });
  }

  onSubmit(): void {
    if (this.areaForm.valid) {
      const formData = this.areaForm.value;

      // ✅ Update existing area logic
      this.curdService
        .updateData(`areas/${this.areaId}`, formData)
        .subscribe({
          next: () => {
            this.showSnackBar('Area updated successfully!');
            this.router.navigate(['/master/area']);
          },
          error: () => {
            this.showSnackBar('Failed to update area.');
          },
        });
    } else {
      this.showSnackBar('Please fill all required fields.');
    }
  }

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  onCancel(): void {
    this.router.navigate(['/master/area']);
  }

  reset() {
    this.areaForm.reset();
    this.areaForm.markAsPristine();
    this.areaForm.markAsUntouched();
    this.isEditMode = false;
  
    // Reset default value for status (if needed)
    this.areaForm.patchValue({
      status: '',
      _id: null,
      cname: '',
      aname: '',
      pincode: ''
    });
  
    this.showSnackBar('Form reset successfully!');
  }
}