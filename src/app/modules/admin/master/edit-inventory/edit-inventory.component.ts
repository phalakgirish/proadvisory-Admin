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
import { ActivatedRoute, Router } from '@angular/router';
import { CurdService } from 'app/services/curd.service';
@Component({
  selector: 'app-edit-inventory',
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
  templateUrl: './edit-inventory.component.html',
  styleUrl: './edit-inventory.component.scss'
})
export class EditInventoryComponent implements OnInit {
  inventoryForm!: FormGroup;
  isEditMode = false;
  inventoryId!: string;
  bkhOptions: string[] = ['0','1', '2', '3', '4', '5'];
  statusOptions = [
    { value: 'Active', viewValue: 'Active' },
    { value: 'Inactive', viewValue: 'Inactive' }
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
    this.route.queryParams.subscribe((params) => {
      if (params['_id']) {
        this.isEditMode = true;
        this.inventoryId = params['_id'];
        this.patchForm(params);
      }
    });
  }

  createForm(): void {
    this.inventoryForm = this.fb.group({
      inventoryName: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s]*$/)]
      ],
      noOfBKH: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }

  patchForm(data: any): void {
    this.inventoryForm.patchValue({
      inventoryName: data.inventoryName,
      noOfBKH: data.noOfBKH,
      status: data.status,
    });
  }

  onSubmit(): void {
    if (this.inventoryForm.valid) {
      const formData = this.inventoryForm.value;
      if (this.isEditMode) {
        this.curdService
          .updateData(`inventories/${this.inventoryId}`, formData)
          .subscribe({
            next: () => {
              this.showSnackBar('Inventory updated successfully!');
              this.router.navigate(['/master/inventory']);
            },
            error: () => {
              this.showSnackBar('Failed to update inventory.');
            },
          });
      }
    } else {
      this.showSnackBar('Please fill all required fields!');
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
    this.router.navigate(['/master/inventory']);
  }
}