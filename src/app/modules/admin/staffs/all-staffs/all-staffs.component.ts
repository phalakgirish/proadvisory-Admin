import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
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
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { AllStaffService } from './all-staffs.service';
import { AllStaffs } from './all-staffs.model';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-all-staff',
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
    animations: [rowsAnimation],
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
        NgClass,
        FeatherIconsComponent,
        MatRippleModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatPaginatorModule,
        DatePipe,
    ],
    templateUrl: './all-staffs.component.html',
    styleUrls: ['./all-staffs.component.scss']
})
export class AllStaffsComponent implements OnInit, OnDestroy {
  staffList: AllStaffs[] = [];

  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'name', label: 'Name', type: 'test', visible: true },
    { def: 'usertype', label: 'User Type', type: 'test', visible: true },
    { def: 'mobile', label: 'Mobile', type: 'phone', visible: true },
    { def: 'email', label: 'Email', type: 'email', visible: true },
    { def: 'date', label: 'Joining Date', type: 'date', visible: true },
    { def: 'address', label: 'Address', type: 'address', visible: true },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];
  
  dummyStaffs: AllStaffs[] = [
    {
      id: 1,
      name: 'John Doe',
      usertype: 'Admin',
      mobile: '9876543210',
      email: 'john.doe@example.com',
      password: 'password123', // Add a default password
      date: '2023-01-10',
      address: '123 Main St, Cityville',
      img: 'https://via.placeholder.com/40',
      getRandomID: () => Math.floor(Math.random() * 1000), // Provide a function for getRandomID
    },
    {
      id: 2,
      name: 'Jane Smith',
      usertype: 'Manager',
      mobile: '9123456789',
      email: 'jane.smith@example.com',
      password: 'password456',
      date: '2022-11-20',
      address: '456 Elm St, Townsville',
      img: 'https://via.placeholder.com/40',
      getRandomID: () => Math.floor(Math.random() * 1000),
    },
    {
      id: 3,
      name: 'Michael Brown',
      usertype: 'Staff',
      mobile: '9087654321',
      email: 'michael.brown@example.com',
      password: 'password789',
      date: '2021-05-15',
      address: '789 Oak St, Villagetown',
      img: 'https://via.placeholder.com/40',
      getRandomID: () => Math.floor(Math.random() * 1000),
    },
  ];
  
  

  dataSource = new MatTableDataSource<AllStaffs>(this.dummyStaffs);
  selection = new SelectionModel<AllStaffs>(true, []);
  private destroy$ = new Subject<void>();
  contextMenuPosition = { x: '0px', y: '0px' };
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;

  constructor(
    private httpClient: HttpClient,
    private dialog: MatDialog,
    private allStaffService: AllStaffService,
    private snackBar: MatSnackBar,
    private store: LocalStorageService
  ) {}

  loadDummyData() {
    this.dataSource.data = this.dummyStaffs;
    this.isLoading = false;
    this.refreshTable();
  }
  

  ngOnInit() {
    console.log('Component Initialized'); // Debugging
    this.loadDummyData();
    console.log(this.dataSource.data); // Check if data is loaded
  }
  

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refresh() {
    this.loadData();
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
  }

  editCall(row: AllStaffs) {
    this.openDialog('edit', row);
  }

  addNew() {
    this.openDialog('add');
  }

  openDialog(action: 'add' | 'edit', data?: AllStaffs) {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { allStaffs: data, action },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (action === 'add') {
          this.dataSource.data = [result, ...this.dataSource.data];
        } else {
          this.updateRecord(result);
        }
        this.refreshTable();
        this.showNotification(
          action === 'add' ? 'snackbar-success' : 'black',
          `${action === 'add' ? 'Add' : 'Edit'} Record Successfully...!!!`,
          'bottom',
          'center'
        );
      }
    });
  }

  private updateRecord(updatedRecord: AllStaffs) {
    const index = this.dataSource.data.findIndex(
      (record) => record.id === updatedRecord.id
    );
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription();
    }
  }

  deleteItem(row: AllStaffs) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, { data: row });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.data = this.dataSource.data.filter(
          (record) => record.id !== row.id
        );
        this.refreshTable();
        this.showNotification(
          'snackbar-danger',
          'Delete Record Successfully...!!!',
          'bottom',
          'center'
        );
      }
    });
  }

  private refreshTable() {
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.dataSource.data = this.dataSource.data.filter(
      (item) => !this.selection.selected.includes(item)
    );
    this.selection.clear();
    this.showNotification(
      'snackbar-danger',
      `${totalSelect} Record(s) Deleted Successfully...!!!`,
      'bottom',
      'center'
    );
  }

  loadData() {
    this.allStaffService.getAllStaffs().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
        this.refreshTable();
        this.dataSource.filterPredicate = (data: AllStaffs, filter: string) =>
          Object.values(data).some((value) =>
            value.toString().toLowerCase().includes(filter)
          );
      },
      error: (err) => console.error(err),
    });
  }

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  exportExcel() {
    const exportData = this.dataSource.filteredData.map((x) => ({
      Name: x.name,
      usertype: x.usertype,
      'Joining Date': x.date,
      Mobile: x.mobile,
      Email: x.email,
      Address: x.address,
    }));

    TableExportUtil.exportToExcel(exportData, 'excel');
  }

  onContextMenu(event: MouseEvent, item: AllStaffs) {
    event.preventDefault();
    this.contextMenuPosition = {
      x: `${event.clientX}px`,
      y: `${event.clientY}px`,
    };
    if (this.contextMenu) {
      this.contextMenu.menuData = { item };
      this.contextMenu.menu?.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }
}
