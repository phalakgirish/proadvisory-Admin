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
import { Subject } from 'rxjs';
import { City } from 'app/interfaces/city';
import { CityService } from 'app/services/city.service';
import { CurdService } from 'app/services/curd.service';

@Component({
  selector: 'app-city',
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
        ],
  templateUrl: './city.component.html',
  styleUrl: './city.component.scss'
})
export class CityComponent implements OnInit {
  cityForm: FormGroup;
  columnDefinitions = [
    { def: 'select', label: 'Select', visible: true },
    { def: 'cname', label: 'City Name', visible: true },
    { def: 'status', label: 'Status', visible: true },
    { def: 'actions', label: 'Actions', visible: true },
  ];
  displayedColumns: string[] = this.columnDefinitions.map(col => col.def);
  dataSource = new MatTableDataSource<City>([]);
  selection = new SelectionModel<City>(true, []);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fb: FormBuilder, private curdService: CurdService, private snackBar: MatSnackBar) {
    this.cityForm = this.fb.group({
      cname: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchCities();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
  
  removeSelectedRows(): void {
    const selectedRows = this.selection.selected;
    if (selectedRows.length > 0) {
      if (confirm('Are you sure you want to delete the selected rows?')) {
        selectedRows.forEach(city => {
          this.curdService.deleteData(`city/${city.id}`).subscribe({
            next: () => {
              this.dataSource.data = this.dataSource.data.filter(row => row.id !== city.id);
              this.selection.clear();
              this.showSnackBar('Selected rows deleted successfully!');
            },
            error: (error: any) => {
              console.error('Error deleting rows:', error);
              this.showSnackBar('Failed to delete selected rows.');
            },
          });
        });
      }
    } else {
      this.showSnackBar('No rows selected.');
    }
  }

  deleteItem(row: City): void {
    if (!row.id) {
      console.error("Error: City ID is undefined", row);
      this.showSnackBar("Error: City ID is missing.");
      return;
    }
  
    if (confirm(`Are you sure you want to delete "${row.cname}"?`)) {
      this.curdService.deleteData(`city/${row.id}`).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(item => item.id !== row.id);
          this.showSnackBar(`City "${row.cname}" deleted successfully!`);
        },
        error: (error: any) => {
          console.error("Error deleting city:", error);
          this.showSnackBar(`Failed to delete city "${row.cname}".`);
        },
      });
    }
  }

  addNew(): void {
    this.cityForm.reset();
    this.cityForm.markAsUntouched();
    this.cityForm.markAsPristine();
  }

  refresh(): void {
    this.fetchCities();
    this.showSnackBar('Table refreshed successfully!');
  }

  fetchCities(): void {
    this.curdService.getData<City[]>('city').subscribe({
      next: (cities) => {
        console.log("Fetched cities:", cities);
        this.dataSource.data = cities;
      },
      error: (error) => {
        console.error("Error fetching cities:", error);
      },
    });
  }
  

  onSubmit(): void {
    if (this.cityForm.valid) {
      const newCity: City = this.cityForm.value;
      this.curdService.postData('city', newCity).subscribe({
        next: (response: City) => {
          console.log('City added:', response);
          alert(`City "${response.cname}" added successfully!`);
          this.cityForm.reset();
          this.dataSource.data = [...this.dataSource.data, response];
        },
        error: (error) => {
          console.error('Error adding city:', error);
        },
      });
    }
  }

  editCall(row: City): void {
    this.cityForm.patchValue({
      cname: row.cname,
      status: row.status,
    });

    this.cityForm.get('id')?.setValue(row.id);

    this.showSnackBar(`Editing city: ${row.cname}`);
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions.filter(col => col.visible).map(col => col.def);
  }
}