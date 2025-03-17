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


interface Inventory {
  propertyArea: string;
  price: number;
  uploadFile: string;
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
  removeSelectedRows() {
    throw new Error('Method not implemented.');
  }
  inventoryForm: FormGroup;
  propertyAreas = ['Area 1', 'Area 2', 'Area 3', 'Area 4', 'Area 5'];
  dataSource = new MatTableDataSource<Inventory>([
    { propertyArea: 'Area 1', price: 1500, uploadFile: 'https://via.placeholder.com/150' },
    { propertyArea: 'Area 2', price: 2000, uploadFile: 'https://via.placeholder.com/200' },
    { propertyArea: 'Area 3', price: 2500, uploadFile: 'https://via.placeholder.com/250' },
    { propertyArea: 'Area 4', price: 3000, uploadFile: 'https://via.placeholder.com/300' },
    { propertyArea: 'Area 5', price: 3500, uploadFile: 'https://via.placeholder.com/350' },
    { propertyArea: 'Area 1', price: 1800, uploadFile: 'https://via.placeholder.com/180' },
    { propertyArea: 'Area 2', price: 2200, uploadFile: 'https://via.placeholder.com/220' },
    { propertyArea: 'Area 3', price: 2700, uploadFile: 'https://via.placeholder.com/270' },
    { propertyArea: 'Area 4', price: 3200, uploadFile: 'https://via.placeholder.com/320' },
    { propertyArea: 'Area 5', price: 3700, uploadFile: 'https://via.placeholder.com/370' },
  ]);
  displayedColumns: string[] = ['propertyArea', 'price', 'uploadFile', 'actions'];
  selection = new SelectionModel<Inventory>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Definite assignment
  @ViewChild(MatSort) sort!: MatSort; // Definite assignment

  constructor(private fb: FormBuilder,private dialog: MatDialog) {
    this.inventoryForm = this.fb.group({
      propertyArea: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1000)]],
      uploadFile: ['']
    });
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onSubmit(): void {
    if (this.inventoryForm.valid) {
      const newInventory: Inventory = this.inventoryForm.value;
      this.dataSource.data = [...this.dataSource.data, newInventory];
      this.inventoryForm.reset();
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addNew(): void {
    // Implement your add new logic here if needed
  }

  refresh(): void {
    // Implement your refresh logic here if needed
  }

  exportExcel(): void {
    
  }

  editCall(row: Inventory): void {
    const index = this.dataSource.data.indexOf(row);
    if (index >= 0) {
      this.inventoryForm.patchValue(row);
      this.dataSource.data.splice(index, 1);
      this.dataSource.data = [...this.dataSource.data];
    }
  }

  deleteItem(row: Inventory): void {
    const index = this.dataSource.data.indexOf(row);
    if (index >= 0) {
      this.dataSource.data.splice(index, 1);
      this.dataSource.data = [...this.dataSource.data];
    }
  }

  viewImage(row: Inventory): void {
    if (row.uploadFile) {
      const dialogRef = this.dialog.open(ImagePreviewDialogComponent, {
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
}