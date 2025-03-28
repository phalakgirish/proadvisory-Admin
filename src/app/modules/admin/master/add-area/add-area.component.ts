import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { FeatherIconsComponent } from "../../../../shared/components/feather-icons/feather-icons.component";
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurdService } from 'app/services/curd.service';
import { City } from 'app/interfaces/city';
import { Router } from '@angular/router';


interface Area {
  _id?: string; // Ensure 'id' is optional to prevent errors
  cname: any;
  aname: string;
  pincode: string;
  status: string;
}


@Component({
  selector: 'app-add-area',
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
    PageHeaderComponent],
  templateUrl: './add-area.component.html',
  styleUrl: './add-area.component.scss'
})
export class AddAreaComponent implements OnInit, AfterViewInit {
  areaForm!: FormGroup;
  dataSource = new MatTableDataSource<Area>();
  displayedColumns: string[] = ['select', 'cname', 'aname', 'pincode', 'status', 'actions'];
  selection = new SelectionModel<Area>(true, []);
  isEditMode = false; 
  cityOptions: any;
  statusOptions = [
    { value: 'Active', viewValue: 'Active' },
    { value: 'Inactive', viewValue: 'Inactive' },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private curdService: CurdService,
    private snackBar: MatSnackBar,
    private router :Router,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.fetchCities();
    this.fetchAreas();
    
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createForm(): void {
    this.areaForm = this.fb.group({
      _id: [null], 
      cname: ['', Validators.required],
      aname: [ '',
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s]*$/)]
      ],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      status: ['', Validators.required],
    });
  }
  
  

  fetchAreas(): void {
    this.curdService.getData<Area[]>('areas').subscribe({
      next: (areas) => {
        this.dataSource.data = areas;
      },
      error: () => {
        this.showSnackBar('Failed to load areas.');
      },
    });
  }

  fetchCities(): void {
    this.curdService.getData<City[]>('city').subscribe({
      next: (city) => {
        console.log(city);
        this.cityOptions = city;

      },
      error: () => {
        this.showSnackBar('Failed to load Cities.');
      },
    });
  }

  onSubmit(): void {
    if (this.areaForm.valid) {
      const formData: Area = this.areaForm.value;
  
      if (formData._id) {
        // ✅ Update logic
        this.curdService.updateData(`areas/${formData._id}`, formData).subscribe({
          next: (updatedArea) => {
            const index = this.dataSource.data.findIndex((area) => area._id === updatedArea._id);
            if (index !== -1) {
              this.dataSource.data[index] = updatedArea;
            }
            this.dataSource._updateChangeSubscription();
            this.resetForm(`Area "${updatedArea.aname}" updated successfully!`); // ✅ Pass update message
          },
          error: () => {
            this.showSnackBar('Failed to update area.');
          },
        });
      } else {
        // ✅ Add new area logic
        this.curdService.postData('areas', formData).subscribe({
          next: (newArea) => {
            this.dataSource.data = [...this.dataSource.data, newArea];
            this.dataSource._updateChangeSubscription();
            this.router.navigate(['/master/area']);
            this.resetForm(`Area "${newArea.aname}" added successfully!`); 
          },
          error: () => {
            this.showSnackBar('Failed to add area.');
          },
        });
      }
    } else {
      this.showSnackBar('Please fill all required fields.');
    }
  }
  
  

  deleteItem(row: Area): void {
    if (!row._id) {
      this.showSnackBar("Error: Area ID is missing.");
      return;
    }
  
    if (confirm(`Are you sure you want to delete "${row.aname}"?`)) {
      this.curdService.deleteData(`areas/${row._id}`).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter((area) => area._id !== row._id);
          this.dataSource._updateChangeSubscription();
          this.showSnackBar(`Area "${row.aname}" deleted successfully!`);
        },
        error: () => {
          this.showSnackBar(`Failed to delete area "${row.aname}".`);
        },
      });
    }
  }
  
  

  removeSelectedRows(): void {
    const selectedRows = this.selection.selected;
  
    if (selectedRows.length === 0) {
      this.showSnackBar('No rows selected for deletion.');
      return;
    }
  
    if (confirm(`Are you sure you want to delete ${selectedRows.length} selected areas?`)) {
      const deleteRequests = selectedRows.map((row) =>
        this.curdService.deleteData(`areas/${row._id}`).toPromise()
      );
  
      Promise.all(deleteRequests)
        .then(() => {
          this.dataSource.data = this.dataSource.data.filter(
            (area) => !this.selection.isSelected(area)
          );
          this.selection.clear();
          this.showSnackBar(`${selectedRows.length} areas deleted successfully.`);
        })
        .catch(() => {
          this.showSnackBar('Error deleting selected areas.');
        });
    }
  }
  

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  
  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }
  

  editCall(row: Area): void {
    this.areaForm.patchValue({
      _id: row._id, 
      cname: row.cname?._id || row.cname,
      aname: row.aname,
      pincode: row.pincode,
      status: row.status,
    });
    this.isEditMode = true;
    this.showSnackBar(`Editing area: ${row.aname}`);
  }
  

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  refresh(): void {
    this.fetchAreas();
    this.showSnackBar('Table refreshed successfully!');
  }

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  resetForm(successMessage?: string): void {
    this.areaForm.reset();
    this.areaForm.get('status')?.setValue('');
    this.areaForm.get('_id')?.setValue(null);
    this.isEditMode = false;
  
    if (successMessage) {
      this.showSnackBar(successMessage);
    } else {
      this.showSnackBar('Form reset successfully!');
    }
  }
  
  
  
  addNew(): void {
    this.router.navigate(['/master/area']);
  }
  

  pageEvent(event: PageEvent): void {
    console.log("Page event triggered:", event);
  }
  
}