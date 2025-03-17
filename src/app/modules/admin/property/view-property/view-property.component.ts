import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule, NgClass, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { AllPropertyModule } from './view-property.module';
import { AllPropertyService } from './view-property.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-view-property',
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
    MatPaginatorModule,
    DatePipe,
    
  ],
  templateUrl: './view-property.component.html',
  styleUrl: './view-property.component.scss'
})
export class ViewPropertyComponent implements OnInit {
  
  isLoading = false;
  filterValue: string = '';

  constructor(private router: Router) { }

  columnDefinitions = [
    { def: 'propertyName', label: 'Property Name', type: 'text', visible: true },
    { def: 'reraNumber', label: 'RERA Number', type: 'text', visible: true },
    { def: 'city', label: 'City', type: 'text', visible: true },
    { def: 'pincode', label: 'Pincode', type: 'text', visible: true },
    { def: 'price', label: 'Price', type: 'currency', visible: true },
    { def: 'propertyType', label: 'Property Type', type: 'text', visible: true },
    { def: 'possessionDate', label: 'Possession Date', type: 'date', visible: true },
    { def: 'actions', label: 'Actions', type: 'button', visible: true }
    
  ];

  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.loadData();
    }, 2000);
  }

  loadData() {
    this.dataSource.data = [
      { propertyName: 'Villa A', reraNumber: 'RERA123', city: 'New York', pincode: '10001', price: 500000,propertyType:'Residential property' ,possessionDate: '2025-06-01' },
      { propertyName: 'Apartment B', reraNumber: 'RERA456', city: 'Los Angeles', pincode: '90001', price: 300000,propertyType:'Residential property' , possessionDate: '2025-08-01' },
      { propertyName: 'House C', reraNumber: 'RERA789', city: 'Chicago', pincode: '60007', price: 400000,propertyType:'Commercial property' , possessionDate: '2025-09-01' }
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
    console.log('Add new property logic here');
  }

  editCall(row: any) {
      this.router.navigate(['/property/edit-property'], { state: { propertyData: row } });
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
