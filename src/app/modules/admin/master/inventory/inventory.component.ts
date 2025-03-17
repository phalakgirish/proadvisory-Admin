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

interface Inventory {
  inventoryName: string;
  noOfBKH: string;
  status: string;
}

@Component({
  selector: 'app-inventory',
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
    NgClass,
    FeatherIconsComponent,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatPaginatorModule,],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit {
  inventoryForm!: FormGroup;
  dataSource = new MatTableDataSource<Inventory>([]);
  bkhOptions: string[] = ['1', '2', '3', '4', '5'];
  statusOptions = [
    { value: 'active', viewValue: 'Active' },
    { value: 'inactive', viewValue: 'Inactive' }
  ];
  selection = new SelectionModel<Inventory>(true, []);
  dummyData: Inventory[] = [
    { inventoryName: 'Inventory 1', noOfBKH: '3', status: 'Active' },
    { inventoryName: 'Inventory 2', noOfBKH: '2', status: 'Inactive' },
    { inventoryName: 'Inventory 3', noOfBKH: '5', status: 'Active' },
    { inventoryName: 'Inventory 4', noOfBKH: '4', status: 'Inactive' },
    { inventoryName: 'Inventory 5', noOfBKH: '1', status: 'Active' }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  columnDefinitions = [
    { def: 'select', label: 'Select', visible: true },
    { def: 'inventoryName', label: 'Inventory Name', visible: true },
    { def: 'noOfBKH', label: 'No of BKH', visible: true },
    { def: 'status', label: 'Status', visible: true },
    { def: 'actions', label: 'Actions', visible: true }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
    this.loadDummyData();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  createForm(): void {
    this.inventoryForm = this.fb.group({
      inventoryName: ['', [Validators.required]],
      noOfBKH: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });
  }

  loadDummyData(): void {
    this.dataSource.data = [...this.dummyData];
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
      const newInventory = this.inventoryForm.value;
      this.dataSource.data = [...this.dataSource.data, newInventory];
      this.inventoryForm.reset();
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editCall(row: Inventory): void {
    console.log('Editing', row);
  }

  deleteItem(row: Inventory): void {
    const index = this.dataSource.data.indexOf(row);
    if (index > -1) {
      this.dataSource.data.splice(index, 1);
      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
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
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.selection.clear();
  }

  refresh(): void {
    
  }

  exportExcel(): void {
    
  }

  trackByFn(index: number, item: any): any {
    return item.label;
  }

  isSelected(row: Inventory): boolean {
    return this.selection.isSelected(row);
  }
}