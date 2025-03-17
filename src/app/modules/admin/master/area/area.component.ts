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


interface Area {
  id?: string; // Ensure 'id' is optional to prevent errors
  cname: string;
  aname: string;
  pincode: string;
  status: string;
}


@Component({
  selector: 'app-area',
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
    PageHeaderComponent, FeatherIconsComponent],
  templateUrl: './area.component.html',
  styleUrl: './area.component.scss'
})
export class AreaComponent implements OnInit, AfterViewInit {
  areaForm!: FormGroup;
  dataSource = new MatTableDataSource<Area>();
  displayedColumns: string[] = ['select', 'cname', 'aname', 'pincode', 'status', 'actions'];
  selection = new SelectionModel<Area>(true, []);

  cityOptions: string[] = ['City 1', 'City 2', 'City 3'];
  statusOptions = [
    { value: 'active', viewValue: 'Active' },
    { value: 'inactive', viewValue: 'Inactive' },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private curdService: CurdService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.fetchAreas();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createForm(): void {
    this.areaForm = this.fb.group({
      id: [''],
      cname: ['', Validators.required],
      aname: ['', Validators.required],
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

  onSubmit(): void {
    if (this.areaForm.valid) {
      const newArea: Area = this.areaForm.value;

      if (newArea.id) {
        this.curdService.updateData(`areas/${newArea.id}`, newArea).subscribe({
          next: (updatedArea) => {
            this.dataSource.data = this.dataSource.data.map(area =>
              area.id === updatedArea.id ? updatedArea : area
            );
            this.showSnackBar(`Area "${updatedArea.aname}" updated successfully!`);
          },
          error: () => {
            this.showSnackBar('Failed to update area.');
          },
        });
      } else {
        this.curdService.postData('areas', newArea).subscribe({
          next: (response) => {
            this.dataSource.data = [...this.dataSource.data, response];
            this.showSnackBar(`Area "${response.aname}" added successfully!`);
          },
          error: () => {
            this.showSnackBar('Failed to add area.');
          },
        });
      }

      this.areaForm.reset();
    }
  }

  deleteItem(row: Area): void {
    if (!row.id) {
      this.showSnackBar("Error: Area ID is missing.");
      return;
    }

    if (confirm(`Are you sure you want to delete "${row.aname}"?`)) {
      this.curdService.deleteData(`areas/${row.id}`).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(area => area.id !== row.id);
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
      const deleteRequests = selectedRows.map(row =>
        this.curdService.deleteData(`areas/${row.id}`).toPromise()
      );
  
      Promise.all(deleteRequests)
        .then(() => {
          this.dataSource.data = this.dataSource.data.filter(area => !this.selection.isSelected(area));
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
    this.areaForm.patchValue(row);
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

  addNew(): void {
    this.areaForm.reset();
  }

  pageEvent(event: PageEvent): void {
    console.log("Page event triggered:", event);
  }
  
}