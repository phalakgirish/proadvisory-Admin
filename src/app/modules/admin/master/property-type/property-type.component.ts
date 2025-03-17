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

interface PropertyType {
  ptname: string;
  status: string;
}

@Component({
  selector: 'app-property-type',
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
    FeatherIconsComponent,
    MatCheckboxModule, 
  ],
  templateUrl: './property-type.component.html',
  styleUrl: './property-type.component.scss'
})
export class PropertyTypeComponent implements OnInit {
  propertyForm!: FormGroup;
  dataSource = new MatTableDataSource<PropertyType>();
  selection = new SelectionModel<PropertyType>(true, []);
  displayedColumns: string[] = ['select', 'ptname', 'status', 'actions'];
  statusOptions = [
    { value: 'active', viewValue: 'Active' },
    { value: 'inactive', viewValue: 'Inactive' }
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
      ptname: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  loadDummyData() {
    const dummyData: PropertyType[] = [ // Use PropertyType[] here
      { ptname: 'Apartment', status: 'Active' },
      { ptname: 'Villa', status: 'Active' },
      { ptname: 'Independent House', status: 'Inactive' },
      { ptname: 'Condominium', status: 'Active' },
      { ptname: 'Townhouse', status: 'Inactive' },
      { ptname: 'Duplex', status: 'Active' },
      { ptname: 'Studio Apartment', status: 'Active' },
      { ptname: 'Penthouse', status: 'Inactive' },
      { ptname: 'Bungalow', status: 'Active' },
      { ptname: 'Farmhouse', status: 'Active' },
    ];
    this.dataSource.data = dummyData;
  }

  onSubmit() {
    if (this.propertyForm.valid) {
      const newPropertyType: PropertyType = this.propertyForm.value;
      this.dataSource.data = [...this.dataSource.data, newPropertyType];
      this.propertyForm.reset();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editCall(row: PropertyType) {
    // Edit logic here
    console.log('Editing', row);
  }

  deleteItem(row: PropertyType) {
    const index = this.dataSource.data.indexOf(row);
    if (index > -1) {
      this.dataSource.data.splice(index, 1);
      this.refreshTable();
    }
  }

  viewImage(row: PropertyType) {
    this.dialog.open(ImagePreviewDialogComponent, {
      data: { imageUrl: row.ptname } // Assuming ptname holds the image URL
    });
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  removeSelectedRows() {
    this.selection.selected.forEach(item => {
      const index: number = this.dataSource.data.findIndex(d => d === item);
      this.dataSource.data.splice(index, 1);
    });
    this.refreshTable();
    this.selection.clear(); // Clear the selection after removing rows
  }

  refresh() {
    // Refresh logic here (e.g., reload data from API)
    this.loadDummyData();
  }

  addNew() {
    // Implement your add new logic here
    console.log('Adding new item');
  }

  exportExcel() {
    // Excel export logic here
  }

  trackByFn(index: number, item: any) {
    return item.label; // Assuming your items have a 'label' property
  }

  isSelected(row: PropertyType): boolean {
    return this.selection.isSelected(row);
  }

  pageEvent(event: PageEvent) {
    console.log('Page event:', event);
    // Handle page change event here
  }

  private refreshTable() {
    this.dataSource.data = [...this.dataSource.data];
    this.dataSource = new MatTableDataSource<PropertyType>(this.dataSource.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}