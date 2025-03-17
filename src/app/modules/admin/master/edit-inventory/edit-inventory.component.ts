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
  inventoryData: any; // This will hold the inventory data passed for editing
  bkhOptions = [1, 2, 3, 4, 5]; // Example BKH options
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
    // Get the 'id' parameter from the route (the inventory ID)
    const inventoryId = this.route.snapshot.paramMap.get('id');
    
    // Simulate fetching data for the inventory with the given id
    this.loadInventoryData(inventoryId);

    // Initialize the form with existing data
    this.createForm();
  }

  loadInventoryData(id: string | null): void {
    // Simulated data (replace this with an actual API call to fetch inventory details)
    const dummyData = [
      { id: '1', inventoryName: 'Inventory 1', noOfBKH: 2, status: 'active' },
      { id: '2', inventoryName: 'Inventory 2', noOfBKH: 3, status: 'inactive' },
    ];

    // Find the inventory by ID
    this.inventoryData = dummyData.find(inventory => inventory.id === id);
  }

  createForm(): void {
    // Initialize the form with the existing inventory data
    this.inventoryForm = this.fb.group({
      inventoryName: [this.inventoryData?.inventoryName, [Validators.required]],
      noOfBKH: [this.inventoryData?.noOfBKH, [Validators.required]],
      status: [this.inventoryData?.status, [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.inventoryForm.valid) {
      // Update the inventory data (you can send it to your API here)
      const updatedInventory = this.inventoryForm.value;
      console.log('Updated Inventory:', updatedInventory);

      // Navigate to another page or show a success message
      this.router.navigate(['/inventory-list']);  // Example redirect to the inventory list page
    }
  }
}