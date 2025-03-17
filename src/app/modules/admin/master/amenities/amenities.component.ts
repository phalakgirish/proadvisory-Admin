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

interface Amenity {
  amenityName: string;
  status: string;
  uploadFile: string;
}

@Component({
  selector: 'app-amenities',
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
    MatCheckboxModule,
    FeatherIconsComponent,
],
  templateUrl: './amenities.component.html',
  styleUrl: './amenities.component.scss'
})
export class AmenitiesComponent implements OnInit {
  amenityForm!: FormGroup;
  dataSource = new MatTableDataSource<Amenity>();
  statusOptions = [
    { value: 'active', viewValue: 'Active' },
    { value: 'inactive', viewValue: 'Inactive' }
  ];
  selection = new SelectionModel<Amenity>(true, []);
  dummyData: Amenity[] = [
    { amenityName: 'Amenity 1', status: 'Active', uploadFile: 'assets/images/image_7c9ca6.jpg' },
    { amenityName: 'Amenity 2', status: 'Inactive', uploadFile: 'assets/images/image_7c9ca6.jpg' },
    { amenityName: 'Amenity 3', status: 'Active', uploadFile: 'assets/images/image_7c9ca6.jpg' },
    { amenityName: 'Amenity 4', status: 'Inactive', uploadFile: 'assets/images/image_7c9ca6.jpg' },
    { amenityName: 'Amenity 5', status: 'Active', uploadFile: 'assets/images/image_7c9ca6.jpg' },
  ];
  
  displayedColumns: string[] = ['select', 'amenityName', 'status', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;



  constructor(private fb: FormBuilder, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.createForm();
    this.loadDummyData();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createForm(): void {
    this.amenityForm = this.fb.group({
      amenityName: ['', [Validators.required]],
      status: ['', [Validators.required]],
      uploadFile: ['']
    });
  }

  loadDummyData(): void {
    this.dataSource.data = [...this.dummyData];
  }

  addNew(): void {
    this.amenityForm.reset(); // Reset the form for a new entry
  }

  onSubmit(): void {
    if (this.amenityForm.valid) {
      const newAmenity = this.amenityForm.value;
      this.dataSource.data = [...this.dataSource.data, newAmenity];
      this.dataSource = new MatTableDataSource(this.dataSource.data); // Reassign dataSource
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.amenityForm.reset();
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editCall(row: Amenity): void {
    // Edit logic here
    console.log('Editing', row);
  }

  deleteItem(row: Amenity): void {
    const index = this.dataSource.data.indexOf(row);
    if (index > -1) {
      this.dataSource.data.splice(index, 1);
      this.dataSource.data = [...this.dataSource.data]; // Trigger change detection
    }
  }

  viewImage(row: Amenity): void {
    const dialogRef = this.dialog.open(ImagePreviewDialogComponent, {
      data: { imageUrl: row.uploadFile }
    });
  }

  masterToggle(): void {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  removeSelectedRows(): void {
    this.selection.selected.forEach(row => {
      const index = this.dataSource.data.indexOf(row);
      if (index > -1) {
        this.dataSource.data.splice(index, 1);
      }
    });
    this.dataSource.data = [...this.dataSource.data]; // Trigger change detection
    this.selection.clear();
  }

  refresh(): void {
    this.dataSource.data = [...this.dummyData]; // Reload dummy data
  }

  exportExcel(): void {
    
  }

  trackByFn(index: number, item: any): any {
    return item.label;
  }

  isSelected(row: Amenity): boolean {
    return this.selection.isSelected(row);
  }

  pageEvent(event: PageEvent) {
    console.log("Page event:", event);
    // Handle page change event here
  }
}