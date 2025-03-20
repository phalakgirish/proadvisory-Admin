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
import { CurdService } from 'app/services/curd.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Property {
  _id: string;
  propertyName: string;
  reraNumber: string;
  city: string;
  area: string;
  pincode: string;
  propertySubType: string;
  bedNo: number;
  carpetArea: string;
  floor: string;
  inventory: string;
  amenities: string;
  possessionDate: any;
  uploadFile: string;
  minPrice: number; 
  maxPrice: number; 
  pricePerSqFt: number; 
  mapLink: string;
  advisorName: string;
  description: string;
  propertyStatus: string;
  propertyType: string;
}


interface Inventory {
  propertyArea: string;
  carpetArea: number;
  minPrice: number;
  maxPrice: number;
  uploadFile: string;
  builtUpArea:string;
  inventoryName: string;
  id?: number; 
}

@Component({
  selector: 'app-property-inventory',
  imports: [
    CommonModule,
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
    MatCheckboxModule,
    FeatherIconsComponent,


  ],
  templateUrl: './property-inventory.component.html',
  styleUrl: './property-inventory.component.scss'
})
export class PropertyInventoryComponent implements OnInit {

  inventoryForm: FormGroup;

  dataSource = new MatTableDataSource<Inventory>([]);
  displayedColumns: string[] = [
    'propertyName', // Updated to propertyName,
    'carpetArea',
    'minPrice',
    'maxPrice',
    'actions',
  ];
  selection = new SelectionModel<Inventory>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  inventoryOptions: any;
  propertyOptions:any;

  constructor(private fb: FormBuilder, private dialog: MatDialog, private curdService: CurdService
    ,private snackBar: MatSnackBar,
  ) {
    this.inventoryForm = this.fb.group({
      propertyName: ['', Validators.required],
      inventory: ['', Validators.required],
      carpetArea: [null, [Validators.min(1)]],
      builtUpArea: [null, [Validators.min(1)]],
      minPrice: [null, [Validators.min(1000)]],
      maxPrice: [null, [Validators.min(1000)]],
      uploadFile: [null]
    });
    
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.fetchProperty();
    this.fetchInventory(); // Fetch existing inventories
  }

 

  fetchInventory(): void {
    this.curdService.getData<Inventory[]>('inventories').subscribe({
      next: (inventories) => {
        console.log(inventories);
        this.inventoryOptions = inventories;
      },
      error: () => {
        this.showSnackBar('Failed to load inventory.');
      },
    });
  }

  fetchProperty(): void {
    this.curdService.getData<Property[]>('properties').subscribe({
      next: (properties) => {
        console.log(properties);
        this.propertyOptions = properties;
        // this.dataSource=properties;
      },
      error: () => {
        this.showSnackBar('Failed to load inventory.');
      },
    });
  }

  onSubmit(): void {
    if (this.inventoryForm.valid) {
      const newInventory: Inventory = this.inventoryForm.value;
      console.log('Submitted Form Data:', newInventory);
      this.curdService.postData<Inventory>('property-inventory', newInventory).subscribe( // Updated URL
        (response) => {
          this.dataSource.data = [...this.dataSource.data, response];
          this.inventoryForm.reset();
          this.fetchInventory();
        },
        (error) => {
          console.error('Error creating inventory:', error);
          this.showSnackBar('Failed to create inventory.');
        }
      );
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteItem(row: Inventory): void {
    const index = this.dataSource.data.indexOf(row);
    if (index >= 0) {
      this.curdService.deleteData(`inventory/${row.id}`).subscribe(
        () => {
          this.dataSource.data.splice(index, 1);
          this.dataSource.data = [...this.dataSource.data];
        },
        error => {
          console.error('Error deleting inventory:', error);
        }
      );
    }
  }

  editCall(row: Inventory): void {
    const index = this.dataSource.data.indexOf(row);
    if (index >= 0) {
      this.inventoryForm.patchValue(row);
      this.dataSource.data.splice(index, 1);
      this.dataSource.data = [...this.dataSource.data];
    }

    // To send update to the API
    this.curdService.updateData<Inventory>(`inventory/${row.id}`, this.inventoryForm.value).subscribe(
      response => {
        // Handle the response as needed
      },
      error => {
        console.error('Error updating inventory:', error);
      }
    );
  }

  viewImage(row: Inventory): void {
    if (row.uploadFile) {
      this.dialog.open(ImagePreviewDialogComponent, {
        data: { imageUrl: row.uploadFile }
      });
    }
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  pageEvent(event: PageEvent): void {
    // You can handle page events here if needed
  }

  removeSelectedRows() {
    throw new Error('Method not implemented.');
    }
    addNew() {
    throw new Error('Method not implemented.');
    }
    refresh() {
    throw new Error('Method not implemented.');
    }

    showSnackBar(message: string) {
      this.snackBar.open(message, 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    }
}