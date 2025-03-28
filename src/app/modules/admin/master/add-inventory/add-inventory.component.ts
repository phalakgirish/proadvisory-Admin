import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

import {
  MatOptionModule,
  MatRippleModule,
} from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { TableExportUtil } from '@shared';
import { NgClass, CommonModule } from '@angular/common';
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
import { CurdService } from 'app/services/curd.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

interface Inventory {
  _id?: string;
  inventoryName: string;
  noOfBKH: string;
  status: string;
}

@Component({
  selector: 'app-add-inventory',
  imports: [PageHeaderComponent,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatOptionModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatPaginatorModule],
  templateUrl: './add-inventory.component.html',
  styleUrl: './add-inventory.component.scss'
})
export class AddInventoryComponent implements OnInit {
  inventoryForm!: FormGroup;
  inventoryOptions: any;
  dataSource = new MatTableDataSource<Inventory>([]);
  bkhOptions: string[] = ['0', '1', '2', '3', '4', '5'];
  statusOptions = [
    { value: 'Active', viewValue: 'Active' },
    { value: 'Inactive', viewValue: 'Inactive' }
  ];
  selection = new SelectionModel<Inventory>(true, []);
  isEditMode = false;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  columnDefinitions = [
    { def: 'inventoryName', label: 'Inventory Name', visible: true },
    { def: 'noOfBKH', label: 'No of BKH', visible: true },
    { def: 'status', label: 'Status', visible: true },
    { def: 'actions', label: 'Actions', visible: true }
  ];

  constructor(private fb: FormBuilder, private curdService: CurdService, private snackBar: MatSnackBar,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.createForm();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.fetchInventory();
  }

  createForm(): void {
    this.inventoryForm = this.fb.group({
      _id: [null],
      inventoryName: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s]*$/)]
      ],
      noOfBKH: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }



  showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  fetchInventory(): void {
    this.curdService.getData<Inventory[]>('inventories').subscribe({
      next: (inventories) => {
        this.dataSource.data = inventories;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        this.showSnackBar('Failed to load inventory.');
      },
    });
  }

  deleteData(row: Inventory): void {
    const inventoryName =
      typeof row.inventoryName === 'string' ? row.inventoryName : 'Unknown Inventory';

    if (confirm(`Are you sure you want to delete inventory: ${inventoryName}?`)) {
      this.curdService.deleteData(`inventories/${row._id}`).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(
            (item) => item._id !== row._id
          );
          this.showSnackBar('Inventory deleted successfully!');
          this.refreshTable(); // Refresh the table after deletion
        },
        error: (err) => {
          console.error('Error deleting inventory:', err);
          this.showSnackBar('Failed to delete inventory.');
        },
      });
    }
  }



  addNew(): void {
    const newInventory: Inventory = {
      inventoryName: 'New Inventory',
      noOfBKH: '1',
      status: 'Active'
    };
    this.dataSource.data = [...this.dataSource.data, newInventory];
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions.filter(cd => cd.visible).map(cd => cd.def);
  }

  onSubmit(): void {
    if (this.inventoryForm.valid) {
      const formData = this.inventoryForm.value;

      if (this.isEditMode && formData._id) {
        // ✅ Update existing inventory
        this.curdService.updateData<Inventory>(`inventories/${formData._id}`, formData).subscribe({
          next: (res) => {
            const index = this.dataSource.data.findIndex((item) => item._id === res._id);
            if (index !== -1) {
              this.dataSource.data[index] = res;
              this.refreshTable(); // ✅ Refresh dataSource
            }
            this.showSnackBar('Inventory updated successfully!');

            this.resetForm();
          },
          error: () => {
            this.showSnackBar('Failed to update inventory.');
          },
        });
      } else {
        // ✅ Add new inventory
        delete formData._id; // Remove _id to avoid confusion when adding
        this.curdService.postData<Inventory>('inventories', formData).subscribe({
          next: (res) => {
            this.dataSource.data = [...this.dataSource.data, res];
            this.refreshTable(); // ✅ Refresh dataSource
            this.showSnackBar('Inventory added successfully!');
            this.router.navigate(['/master/inventory']);
            this.resetForm();
          },
          error: () => {
            this.showSnackBar('Failed to add inventory.');
          },
        });
      }
    } else {
      this.showSnackBar('Please fill all required fields!');
    }
  }


  resetForm(): void {
    this.inventoryForm.reset();
    this.isEditMode = false;
    this.inventoryForm.patchValue({
      _id: null,
      inventoryName: '',
      noOfBKH: '',
      status: '',
    });
  }



  onCancel(): void {
    this.inventoryForm.reset();
    this.showSnackBar('Form reset successfully!');
  }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editCall(row: Inventory): void {
    this.isEditMode = true;
    this.inventoryForm.patchValue({
      _id: row._id,
      inventoryName: row.inventoryName,
      noOfBKH: row.noOfBKH,
      status: row.status,
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


  refresh(): void {
    this.fetchInventory();
    this.showSnackBar('Data refreshed successfully!');
  }

  refreshTable(): void {
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  trackByFn(index: number, item: any): any {
    return item.label;
  }

  isSelected(row: Inventory): boolean {
    return this.selection.isSelected(row);
  }
}