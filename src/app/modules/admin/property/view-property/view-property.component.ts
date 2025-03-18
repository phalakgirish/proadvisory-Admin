import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
import { Router, RouterModule } from '@angular/router';
import { CurdService } from 'app/services/curd.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { City } from 'app/interfaces/city';

interface Property {
  _id?: string; // Optional ID for properties
  propertyName: string; // Name of the property
  reraNumber: string; // RERA registration number
  city: any; // City where the property is located
  pincode: string; // Postal code
  price: number; // Price of the property
  propertyType: any; // Type of the property
  possessionDate: Date; // Date of possession
  status: string; // Status (available/sold)
}


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
    RouterModule
  ],
  templateUrl: './view-property.component.html',
  styleUrl: './view-property.component.scss'
})
export class ViewPropertyComponent implements OnInit, AfterViewInit {
  propertyForm!: FormGroup;
  dataSource = new MatTableDataSource<Property>();
  displayedColumns: string[] = ['propertyName', 'reraNumber', 'city', 'pincode', 'price', 'propertyType', 'possessionDate', 'actions'];
  cityOptions: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private curdService: CurdService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.fetchProperties();
    this.fetchCities();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  addNew(): void {
    this.propertyForm.reset();
    // Optionally, clear any previous error messages or selections.
  }

  refresh(): void {
    this.fetchCities();
    this.fetchProperties();
    this.showSnackBar('Properties refreshed successfully!');
  }

  editCall(row: Property): void {
    console.log(row._id);
    this.router.navigate([`/edit-property/${row._id}`]);

  }

  createForm(): void {
    this.propertyForm = this.fb.group({
      id: [''],
      propertyName: ['', Validators.required],
      reraNumber: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      price: ['', Validators.required],
      propertyType: ['', Validators.required],
      possessionDate: ['', Validators.required]
    });
  }

  fetchProperties(): void {
    this.curdService.getData<Property[]>('properties').subscribe({
      next: (properties) => {
        console.log(properties); 
        this.dataSource.data = properties; 
      },
      error: () => {
        this.showSnackBar('Failed to load properties.');
      },
    });
  }
  

  fetchCities():void{
    this.curdService.getData<City[]>('city').subscribe({
      next: (city) => {
        console.log(city);
        this.cityOptions = city;

      },
      error: () => {
        this.showSnackBar('Failed to load properties.');
      }
    })
  }

  onSubmit(): void {
    if (this.propertyForm.valid) {
      const newProperty: Property = this.propertyForm.value;
      if (newProperty._id) {
        this.curdService.updateData(`properties/${newProperty._id}`, newProperty).subscribe({
          next: (updatedProperty) => {
            this.dataSource.data = this.dataSource.data.map(property => 
              property._id === updatedProperty.id ? updatedProperty : property
            );
            this.showSnackBar(`Property "${updatedProperty.propertyName}" updated successfully!`);
          },
          error: () => {
            this.showSnackBar('Failed to update property.');
          }
        });
      } else {
        this.curdService.postData('properties', newProperty).subscribe({
          next: (response) => {
            this.dataSource.data = [...this.dataSource.data, response];
            this.showSnackBar(`Property "${response.propertyName}" added successfully!`);
          },
          error: () => {
            this.showSnackBar('Failed to add property.');
          }
        });
      }
      this.propertyForm.reset();
    }
  }

  deleteItem(row: Property): void {
    if (!row._id) {
      this.showSnackBar("Error: Property ID is missing.");
      return;
    }
    if (confirm(`Are you sure you want to delete "${row.propertyName}"?`)) {
      this.curdService.deleteData(`properties/${row._id}`).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(property => property._id !== row._id);
          this.showSnackBar(`Property "${row.propertyName}" deleted successfully!`);
        },
        error: () => {
          this.showSnackBar(`Failed to delete property "${row.propertyName}".`);
        }
      });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}