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
  carpetArea: number;
  minPrice: number;
  maxPrice: number;
  uploadFile: string;
  inventoryName: string;
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
  propertyName = ['Sai ', 'Sai Niwas'];
  inventoryTypes = ['Residential', 'Commercial', 'Industrial'];
  dataSource = new MatTableDataSource<Inventory>([
    {
      propertyArea: 'Sai',
      carpetArea: 1000,
      minPrice: 1500000,
      maxPrice: 2500000,
      uploadFile: 'https://via.placeholder.com/150',
      inventoryName: 'Residential',
    },
    {
      propertyArea: 'Sai Niwas',
      carpetArea: 1500,
      minPrice: 2000000,
      maxPrice: 3000000,
      uploadFile: 'https://via.placeholder.com/200',
      inventoryName: 'Commercial',
    },
  ]);
  displayedColumns: string[] = ['propertyArea', 'inventoryName', 'carpetArea', 'minPrice', 'maxPrice', 'uploadFile', 'actions'];
  selection = new SelectionModel<Inventory>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    this.inventoryForm = this.fb.group({
      propertyArea: ['', Validators.required],
      carpetArea: ['', [Validators.min(1)]],
      minPrice: ['', [Validators.min(1000)]],
      maxPrice: ['', [Validators.min(1000)]],
      uploadFile: [''],
      inventoryName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log('Data Source:', this.dataSource.data);
    console.log('Property Names:', this.propertyName);
    console.log('Inventory Types:', this.inventoryTypes);
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