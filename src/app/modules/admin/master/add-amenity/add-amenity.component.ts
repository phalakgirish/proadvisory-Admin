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
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurdService } from 'app/services/curd.service';

interface Amenity {
  _id?:string;
  amenityName: string;
  status: string;
  imageUrl: string;
}

@Component({
  selector: 'app-add-amenity',
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
  templateUrl: './add-amenity.component.html',
  styleUrl: './add-amenity.component.scss'
})
export class AddAmenityComponent implements OnInit {
  amenityForm!: FormGroup;
  dataSource = new MatTableDataSource<Amenity>();
  statusOptions = [
    { value: 'active', viewValue: 'Active' },
    { value: 'inactive', viewValue: 'Inactive' }
  ];
  selection = new SelectionModel<Amenity>(true, []);
  dummyData: Amenity[] = [
    { amenityName: 'Amenity 1', status: 'Active', imageUrl: 'assets/images/image_7c9ca6.jpg' },
    { amenityName: 'Amenity 2', status: 'Inactive', imageUrl: 'assets/images/image_7c9ca6.jpg' },
    { amenityName: 'Amenity 3', status: 'Active', imageUrl: 'assets/images/image_7c9ca6.jpg' },
    { amenityName: 'Amenity 4', status: 'Inactive', imageUrl: 'assets/images/image_7c9ca6.jpg' },
    { amenityName: 'Amenity 5', status: 'Active', imageUrl: 'assets/images/image_7c9ca6.jpg' },
  ];
  
  displayedColumns: string[] = [ 'amenityName', 'status', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;



  constructor(private fb: FormBuilder, public dialog: MatDialog,private snackBar:MatSnackBar,private curdService:CurdService,

  ) {}

  ngOnInit(): void {
    this.createForm();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createForm(): void {
    this.amenityForm = this.fb.group({
      amenityName: ['',
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s]*$/)]
      ],
      status: ['', [Validators.required]],
      imageUrl: ['']
    });
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
  

  addNew(): void {
    this.amenityForm.reset(); // Reset the form for a new entry
  }

  onSubmit(): void {
    if (this.amenityForm.valid) {
      const formData = new FormData();
      formData.append('amenityName', this.amenityForm.value.amenityName);
      formData.append('status', this.amenityForm.value.status);
      formData.append('imageUrl', this.amenityForm.value.imageUrl); // Append file here
  
      this.curdService.postData('amenities', formData).subscribe({
        next: (res) => {
          if (res) {
            this.showSnackBar('Amenity added successfully!');
            this.amenityForm.reset();
          }
        },
        error: (err) => {
          console.error('Error adding amenity:', err);
          this.showSnackBar('Failed to add amenity.');
        },
      });
    } else {
      this.showSnackBar('Please fill all required fields.');
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
      data: { imageUrl: row.imageUrl }
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