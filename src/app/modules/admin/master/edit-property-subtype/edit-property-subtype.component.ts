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
import { CurdService } from 'app/services/curd.service';
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
  propertyTypeOptions: any[] = [];
  subtypeId: string | null = null;
  statusOptions = [
    { value: 'Active', viewValue: 'Active' },
    { value: 'Inactive', viewValue: 'Inactive' }
  ];

  constructor(
    private fb: FormBuilder,
    private curdService: CurdService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.fetchPropertyTypes();

    // Get ID from route and fetch property subtype
    this.subtypeId = this.route.snapshot.paramMap.get('id');
    if (this.subtypeId) {
      this.fetchPropertySubtype(this.subtypeId);
    }
  }

  // Create form for editing property subtype
  createForm() {
    this.propertyForm = this.fb.group({
      propertyType: ['', Validators.required],
      pstname: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s]*$/)],
      ],
      status: ['', Validators.required],
    });
  }

  // Fetch property types for dropdown
  fetchPropertyTypes(): void {
    this.curdService.getData<any[]>('property-types').subscribe({
      next: (propertyTypes) => {
        this.propertyTypeOptions = propertyTypes.map((type) => ({
          _id: type._id,
          ptname: type.ptname,
        }));
      },
      error: () => {
        this.showSnackBar('Failed to load property types.');
      },
    });
  }

  // Fetch property subtype by ID and patch values
  fetchPropertySubtype(id: string): void {
    this.curdService.getData<any>(`property-subtypes/${id}`).subscribe({
      next: (res) => {
        if (res) {
          this.propertyForm.patchValue({
            propertyType:
              typeof res.propertyType === 'object'
                ? res.propertyType._id
                : res.propertyType,
            pstname: res.pstname,
            status: res.status,
          });
        }
      },
      error: () => {
        this.showSnackBar('Failed to load property subtype.');
      },
    });
  }

  // Update property subtype
  onSubmit() {
    if (this.propertyForm.valid && this.subtypeId) {
      this.curdService
        .updateData(`property-subtypes/${this.subtypeId}`, this.propertyForm.value)
        .subscribe({
          next: () => {
            this.showSnackBar('Property subtype updated successfully.');
            this.router.navigate(['/master/property-subtype']);
          },
          error: () => {
            this.showSnackBar('Failed to update property subtype.');
          },
        });
    } else {
      this.showSnackBar('Please fill all required fields.');
    }
  }

  // Show Snackbar Message
  showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  // Cancel and redirect to the property subtype list
  onCancel() {
    this.router.navigate(['/master/property-subtype']);
  }
}