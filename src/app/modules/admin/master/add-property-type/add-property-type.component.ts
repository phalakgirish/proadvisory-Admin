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
import { CurdService } from 'app/services/curd.service';
import { Route, Router } from '@angular/router';

interface PropertyType {
  _id?:string;
  ptname: string;
  status: string;
}

@Component({
  selector: 'app-add-property-type',
  imports: [ReactiveFormsModule,
    CommonModule,
    PageHeaderComponent,
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
    MatCheckboxModule],
  templateUrl: './add-property-type.component.html',
  styleUrl: './add-property-type.component.scss'
})
export class AddPropertyTypeComponent  implements OnInit {
  propertyForm!: FormGroup;
  dataSource = new MatTableDataSource<PropertyType>([]);
  selection = new SelectionModel<PropertyType>(true, []);
  displayedColumns: string[] = [ 'ptname', 'status', 'actions'];
  statusOptions = [
    { value: 'Active', viewValue: 'Active' },
    { value: 'Inactive', viewValue: 'Inactive' },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  propertyOptions: PropertyType[] = [];
  selectedRowId:any;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private curdService: CurdService,
    private snackBar: MatSnackBar,
    public router :Router,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.fetchPropertyType();
  }

  createForm() {
    this.propertyForm = this.fb.group({
      ptname: [ '',
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s]*$/)]
      ],
      status: ['', Validators.required],
    });
  }

  fetchPropertyType(): void {
    this.curdService.getData<PropertyType[]>('property-types').subscribe({
      next: (propertytypes) => {
        this.dataSource.data = propertytypes;
        this.propertyOptions = propertytypes;
        this.refreshTable();
      },
      error: () => {
        this.showSnackBar('Failed to load property types.');
      },
    });
  }

  onSubmit(): void {
    if (this.propertyForm.valid) {
      const formData = this.propertyForm.value;
  
      if (this.selectedRowId) {
        // Update existing property type
        const updatedPropertyType: PropertyType = {
          _id: this.selectedRowId,
          ptname: formData.ptname,
          status: formData.status,
        };
        this.update(updatedPropertyType);
      } else {
        // Add new property type
        this.curdService.postData<PropertyType>('property-types', formData).subscribe({
          next: (response) => {
            this.dataSource.data = [...this.dataSource.data, response];
            this.propertyForm.reset();
            this.selectedRowId = null;
            this.fetchPropertyType(); // Refresh table
            this.showSnackBar('Property type added successfully!');
            this.router.navigate(['/master/property-type']);
          },
          error: (error) => {
            console.error('Error creating property type:', error);
            this.showSnackBar('Failed to create property type.');
          },
        });
      }
    }
  }
  

  delete(row: any): void {
    const propertyTypeName =
      typeof row.ptname === 'string'
        ? row.ptname
        : 'Unknown Property Type';
  
    if (confirm(`Are you sure you want to delete property type: ${propertyTypeName}?`)) {
      this.curdService.deleteData(`property-types/${row._id}`).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(
            (item) => item._id !== row._id
          );
          this.showSnackBar('Property type deleted successfully!');
          this.refreshTable(); // <-- Add this to refresh the table
        },
        error: (err) => {
          console.error('Error deleting property type:', err);
          this.showSnackBar('Failed to delete property type.');
        },
      });
    }
  }
  
  
  

  showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editCall(row: PropertyType) {
    // Set selected row ID for updating
    this.selectedRowId = row._id;
  
    // Populate form with selected row data
    this.propertyForm.patchValue({
      ptname: row.ptname,
      status: row.status,
    });
  }
  

  deleteItem(row: PropertyType) {
    const index = this.dataSource.data.indexOf(row);
    if (index > -1) {
      this.dataSource.data.splice(index, 1);
      this.refreshTable();
      this.showSnackBar('Property type deleted successfully!');
    }
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  createPropertyType(formData: any): void {
    const newPropertyType: PropertyType = {
      ptname: formData.ptname,
      status: formData.status,
    };
  
    this.curdService.postData<PropertyType>('property-types', newPropertyType).subscribe(
      (response) => {
        this.dataSource.data = [...this.dataSource.data, response];
        this.propertyForm.reset();
        this.selectedRowId = null; // Clear selected ID
        this.fetchPropertyType();
        this.showSnackBar('Property type added successfully!');
      },
      (error) => {
        console.error('Error creating property type:', error);
        this.showSnackBar('Failed to create property type.');
      }
    );
  }
  

  update(row: PropertyType): void {
    this.curdService.updateData(`property-types/${row._id}`, row).subscribe({
      next: (response) => {
        const index = this.dataSource.data.findIndex((item) => item._id === row._id);
        if (index !== -1) {
          this.dataSource.data[index] = response;
          this.refreshTable();
        }
        this.resetForm(); // Reset after update
        this.showSnackBar('Property type updated successfully!');
      },
      error: (err) => {
        console.error('Error updating property type:', err);
        this.showSnackBar('Failed to update property type.');
      },
    });
  }
  
  
  
  resetForm(): void {
    this.propertyForm.reset();
    this.selectedRowId = null;
  }
  

  refresh() {
    this.fetchPropertyType();
  }

  addNew(): void {
    this.resetForm();
    console.log('Ready to add new property type.');
  }
  

  trackByFn(index: number, item: PropertyType) {
    return item.ptname;
  }

  isSelected(row: PropertyType): boolean {
    return this.selection.isSelected(row);
  }

  pageEvent(event: PageEvent) {
    console.log('Page event:', event);
    // Handle page change logic if required
  }

  private refreshTable() {
    this.dataSource = new MatTableDataSource<PropertyType>(
      this.dataSource.data
    );
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}