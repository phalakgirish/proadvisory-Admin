import { CommonModule, NgClass, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
interface Staff {
  staffId: number;
  name: string;
  userType: string;
  email: string;
  password: string;
  status: string;
}

const STAFF_DATA: Staff[] = [
 
];

@Component({
  selector: 'app-all-user',
  imports: [

    PageHeaderComponent,
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
        CommonModule,
        MatRippleModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatPaginatorModule,
  ],
  templateUrl: './all-user.component.html',
  styleUrl: './all-user.component.scss'
})
export class AllUserComponent implements OnInit {

  isLoading = false;
  filterValue: string = '';

  columnDefinitions = [
    { def: 'staffId', label: 'Staff ID', type: 'text', visible: true },
    { def: 'name', label: 'Name', type: 'text', visible: true },
    { def: 'userType', label: 'User Type', type: 'text', visible: true },
    { def: 'email', label: 'Email', type: 'text', visible: true },
    { def: 'password', label: 'Password', type: 'text', visible: true },
    { def: 'status', label: 'Status', type: 'text', visible: true },
    { def: 'actions', label: 'Actions', type: 'button', visible: true }
  ];

  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router) { }  // <-- Inject Router here

  ngOnInit() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.loadData();
    }, 2000);
  }

  loadData() {
    this.dataSource.data = [
      { staffId: 'S001', name: 'John Doe', userType: 'Admin', email: 'john@example.com', password: 'password123', status: 'Active' },
      { staffId: 'S002', name: 'Jane Smith', userType: 'User', email: 'jane@example.com', password: 'password456', status: 'Inactive' },
      { staffId: 'S003', name: 'Mark Johnson', userType: 'Admin', email: 'mark@example.com', password: 'password789', status: 'Active' }
    ];
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  removeSelectedRows() {
    const selectedRows = this.selection.selected;
    this.dataSource.data = this.dataSource.data.filter(item => !selectedRows.includes(item));
    this.selection.clear();
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  getDisplayedColumns() {
    return this.columnDefinitions.filter(cd => cd.visible).map(cd => cd.def);
  }

  addNew() {
    console.log('Add new staff logic here');
  }

  editCall(row: any) {
      this.router.navigate(['/users/edit-user'], { state: { staffData: row } });  // <-- Fixed error
  }

  deleteItem(row: any) {
    this.dataSource.data = this.dataSource.data.filter(item => item !== row);
  }

  refresh() {
    this.loadData();
  }

  exportExcel() {
    console.log('Export to Excel logic here');
  }
}