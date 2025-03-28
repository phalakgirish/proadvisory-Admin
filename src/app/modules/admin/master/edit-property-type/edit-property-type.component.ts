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
import { CurdService } from 'app/services/curd.service';

interface PropertyType {
  _id?: string;
  ptname: string;
  status: string;
}

interface QueryParams {
  ptname?: string;
  status?: string;
}


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
  propertyId!: string;
  statusOptions = [
    { value: 'Active', viewValue: 'Active' },
    { value: 'Inactive', viewValue: 'Inactive' },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private curdService: CurdService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.createForm();

    // Get query params and patch values
    this.route.paramMap.subscribe((params) => {
      this.propertyId = params.get('id')!;
    });

    this.route.queryParams.subscribe((queryParams: QueryParams) => {
      if (queryParams) {
        this.propertyForm.patchValue({
          ptname: queryParams.ptname,
          status: queryParams.status,
        });
      }
    });
    
    
    
  }

  createForm(): void {
    this.propertyForm = this.fb.group({
      ptname: [ '',
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s]*$/)]
      ],
      status: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.propertyForm.valid) {
      const updatedPropertyType: PropertyType = {
        _id: this.propertyId,
        ...this.propertyForm.value,
      };

      this.curdService
        .updateData(`property-types/${this.propertyId}`, updatedPropertyType)
        .subscribe({
          next: () => {
            this.showSnackBar('Property type updated successfully!');
            this.router.navigate(['/master']);
          },
          error: (error) => {
            console.error('Error updating property type:', error);
            this.showSnackBar('Failed to update property type.');
          },
        });
    }
  }

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  cancelEdit(): void {
    this.router.navigate(['/master']);
  }
}