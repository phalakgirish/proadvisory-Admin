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
interface PropertySubtype {
  propertyType: string;
  pstname: string;
  status: string;
}

@Component({
  selector: 'app-property-subtype',
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
    PageHeaderComponent, FeatherIconsComponent
  ],
  templateUrl: './property-subtype.component.html',
  styleUrl: './property-subtype.component.scss'
})
export class PropertySubtypeComponent implements OnInit {
  propertyForm!: FormGroup;
  dataSource = new MatTableDataSource<PropertySubtype>();
  displayedColumns: string[] = ['propertyType', 'pstname', 'status', 'actions'];
  statusOptions = [
    { value: 'active', viewValue: 'Active' },
    { value: 'inactive', viewValue: 'Inactive' }
  ];
  propertyTypeOptions = [
    { value: 'apartment', viewValue: 'Apartment' },
    { value: 'villa', viewValue: 'Villa' },
    { value: 'house', viewValue: 'House' }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fb: FormBuilder, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.createForm();
    this.loadDummyData();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createForm() {
    this.propertyForm = this.fb.group({
      propertyType: ['', Validators.required],
      pstname: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  loadDummyData() {
    const dummyData: PropertySubtype[] = [
      { propertyType: 'apartment', pstname: 'Studio', status: 'active' },
      { propertyType: 'villa', pstname: 'Luxury', status: 'inactive' },
      { propertyType: 'house', pstname: 'Bungalow', status: 'active' }
    ];
    this.dataSource.data = dummyData;
  }

  onSubmit() {
    if (this.propertyForm.valid) {
      const newPropertySubtype: PropertySubtype = this.propertyForm.value;
      this.dataSource.data = [...this.dataSource.data, newPropertySubtype];
      this.propertyForm.reset();
      this.refreshTable();
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
    console.log('Editing', row);
    // Implement your edit logic here
  }

  deleteItem(row: PropertySubtype) {
    const index = this.dataSource.data.indexOf(row);
    if (index > -1) {
      this.dataSource.data.splice(index, 1);
      this.refreshTable();
    }
  }

  refresh() {
    this.loadDummyData();
  }

  addNew() {
    console.log('Adding new item');
    // Implement your add new logic here
  }

  exportExcel() {
    // Implement your excel export logic here
    console.log("Exporting to excel");
  }

  trackByFn(index: number, item: any) {
    return item.label;
  }

  pageEvent(event: PageEvent) {
    console.log('Page event:', event);
  }

  private refreshTable() {
    this.dataSource.data = [...this.dataSource.data];
    this.dataSource = new MatTableDataSource<PropertySubtype>(this.dataSource.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}