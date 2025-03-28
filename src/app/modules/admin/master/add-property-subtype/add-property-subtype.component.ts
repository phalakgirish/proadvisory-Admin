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
import { MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { TableExportUtil, LocalStorageService } from '@shared';
import { NgClass, DatePipe, CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { MatCardModule } from '@angular/material/card';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { CurdService } from 'app/services/curd.service';
import { Router } from '@angular/router';

interface PropertySubtype {
  _id?:string;
  propertyType: string | { _id: string; ptname: string };//it can be string or object
  pstname: string;
  status: string;
}

interface PropertyType {
  _id?: string;
  ptname: string;
  status: string;
}

@Component({
  selector: 'app-add-property-subtype',
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
    MatFormFieldModule,
    PageHeaderComponent
  ],
  templateUrl: './add-property-subtype.component.html',
  styleUrl: './add-property-subtype.component.scss'
})
export class AddPropertySubtypeComponent implements OnInit {

  propertyForm!: FormGroup;
  dataSource = new MatTableDataSource<PropertySubtype>();
  displayedColumns: string[] = ['propertyType', 'pstname', 'status', 'actions'];
  statusOptions = [
    { value: 'Active', viewValue: 'Active' },
    { value: 'Inactive', viewValue: 'Inactive' }
  ];
  propertyTypeOptions: any[] = [];
  propertySubtypeOptions: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selectedRowId: any;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private curdService: CurdService,
    private snackBar: MatSnackBar,
    private router:Router,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.fetchPropertySubtypes();
    this.fetchPropertyType();
  }

  // Create form for property subtype
  createForm() {
    this.propertyForm = this.fb.group({
      propertyType: ['', Validators.required],
      pstname: ['',
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s]*$/)]
      ],
      status: ['', Validators.required],
    });
  }

  // Show Snackbar Message
  showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }


  fetchPropertySubtypes(): void {
    this.curdService.getData<PropertySubtype[]>('property-subtypes').subscribe({
      next: (propertySubtypes) => {
        this.dataSource.data = propertySubtypes;
        this.propertySubtypeOptions = propertySubtypes;
        this.refreshTable();
        console.log('Property Subtypes:', propertySubtypes);
      },
      error: () => {
        this.showSnackBar('Failed to load property subtypes.');
      },
    });
  }
  

  fetchPropertyType(): void {
    this.curdService.getData<PropertyType[]>('property-types').subscribe({
      next: (propertytypes) => {
        this.propertyTypeOptions = propertytypes.map((type) => ({
          _id: type._id, // Use _id directly
          ptname: type.ptname,
        }));
        console.log('Property Types:', this.propertyTypeOptions);
      },
      error: () => {
        this.showSnackBar('Failed to load property types.');
      },
    });
  }
  
  

  onSubmit() {
    if (this.propertyForm.valid) {
      const newPropertySubtype: PropertySubtype = {
        propertyType: this.propertyForm.value.propertyType, // Send only _id
        pstname: this.propertyForm.value.pstname,
        status: this.propertyForm.value.status,
      };
  
      if (this.selectedRowId) {
        // ✅ Use updateData for update
        this.curdService
          .updateData<PropertySubtype>(
            `property-subtypes/${this.selectedRowId}`,
            newPropertySubtype
          )
          .subscribe({
            next: (res) => {
              if (res) {
                const index = this.dataSource.data.findIndex(
                  (item) => item._id === this.selectedRowId
                );
                if (index > -1) {
                  this.dataSource.data[index] = res;
                  this.refreshTable();
                }
                this.showSnackBar('Property subtype updated successfully.');
                this.propertyForm.reset();
                this.selectedRowId = null; // Reset after update
              }
            },
            error: () => {
              this.showSnackBar('Failed to update property subtype.');
            },
          });
      } else {
        // ✅ Use postData for add
        this.curdService
          .postData<PropertySubtype>('property-subtypes', newPropertySubtype)
          .subscribe({
            next: (res) => {
              if (res) {
                this.dataSource.data = [...this.dataSource.data, res];
                this.refreshTable();
                this.router.navigate(['/master/property-subtype']);
                this.showSnackBar('Property subtype added successfully.');
                this.propertyForm.reset();
              }
            },
            error: () => {
              this.showSnackBar('Failed to add property subtype.');
            },
          });
      }
    } else {
      this.showSnackBar('Please fill all required fields.');
    }
  }
  
  
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editCall(row: PropertySubtype) {
    console.log('Editing:', row);
    this.selectedRowId = row._id; // Use _id for editing
  
    this.propertyForm.patchValue({
      propertyType: typeof row.propertyType === 'object' ? row.propertyType._id : row.propertyType, // Handle both cases
      pstname: row.pstname,
      status: row.status,
    });
  }
  

  deleteItem(row: PropertySubtype) {
    if (!row || !row._id) {
      this.showSnackBar('Invalid item selected.');
      return;
    }
  
    this.curdService.deleteData(`property-subtypes/${row._id}`).subscribe({
      next: () => {
        const index = this.dataSource.data.findIndex(
          (item) => item._id === row._id
        );
        if (index > -1) {
          this.dataSource.data.splice(index, 1);
          this.dataSource.data = [...this.dataSource.data]; // Reassign to refresh
          this.refreshTable();
          this.showSnackBar('Property subtype deleted successfully.');
        }
      },
      error: () => {
        this.showSnackBar('Failed to delete property subtype.');
      },
    });
  }
  


  // Refresh table after changes
  refresh() {
    this.refreshTable();
  }

  // Add new item logic (if required later)
  addNew() {
    console.log('Adding new item');
  }

  onCancel() {
    this.propertyForm.reset(); 
    this.selectedRowId = null; 
  }
  
  trackByFn(index: number, item: PropertySubtype) {
    return item.pstname;
  }

  pageEvent(event: PageEvent) {
    console.log('Page event:', event);
  }

  private refreshTable() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
}