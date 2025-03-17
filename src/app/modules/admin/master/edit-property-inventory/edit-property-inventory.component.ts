import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { ImagePreviewDialogComponent } from '../image-preview-dialog/image-preview-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FeatherComponent } from 'angular-feather';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-property-inventory',
  imports: [CommonModule,
    PageHeaderComponent,
    FormsModule,
    MatCardModule,
    FileUploadComponent,
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
    MatCheckboxModule],
  templateUrl: './edit-property-inventory.component.html',
  styleUrl: './edit-property-inventory.component.scss'
})
export class EditPropertyInventoryComponent implements OnInit {
  inventoryForm!: FormGroup;
  propertyAreas = ['Area 1', 'Area 2', 'Area 3'];  // Example Property Areas
  inventoryData: any;  // This will hold the property inventory data passed for editing

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the 'id' parameter from the route (the property inventory ID)
    const inventoryId = this.route.snapshot.paramMap.get('id');
    
    // Simulate fetching data for the inventory with the given id
    this.loadInventoryData(inventoryId);

    // Initialize the form with existing data
    this.createForm();
  }

  loadInventoryData(id: string | null): void {
    // Simulate fetching the inventory data (replace with actual API service call)
    const dummyData = [
      { id: '1', propertyArea: 'Area 1', price: 2500, uploadFile: 'assets/images/property1.jpg' },
      { id: '2', propertyArea: 'Area 2', price: 3000, uploadFile: 'assets/images/property2.jpg' },
    ];

    // Find the inventory by ID
    this.inventoryData = dummyData.find(item => item.id === id);
  }

  createForm(): void {
    // Initialize the form with the existing inventory data
    this.inventoryForm = this.fb.group({
      propertyArea: [this.inventoryData?.propertyArea, [Validators.required]],
      price: [this.inventoryData?.price, [Validators.required, Validators.min(1000)]],
      uploadFile: [this.inventoryData?.uploadFile]  // Assuming the uploadFile field holds the file URL
    });
  }

  onSubmit(): void {
    if (this.inventoryForm.valid) {
      // Update the property inventory data (send it to your API)
      const updatedInventory = this.inventoryForm.value;
      console.log('Updated Property Inventory:', updatedInventory);

      // After submitting the form, navigate to another page (e.g., property list)
      this.router.navigate(['/property-inventory-list']);
    }
  }
}