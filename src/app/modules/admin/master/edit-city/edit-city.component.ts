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
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-city',
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
  templateUrl: './edit-city.component.html',
  styleUrl: './edit-city.component.scss'
})
export class EditCityComponent implements OnInit {
  cityForm!: FormGroup;
  cityData: any; // This will hold the city data passed for editing

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the 'id' parameter from the route (the city ID)
    const cityId = this.route.snapshot.paramMap.get('id');
    
    // Simulate fetching data for the city with the given id
    this.loadCityData(cityId);

    // Initialize the form with existing data
    this.createForm();
  }

  loadCityData(id: string | null): void {
    // Simulated data (replace this with an actual API call to fetch city details)
    const dummyData = [
      { id: '1', cname: 'New York', status: 'active' },
      { id: '2', cname: 'Los Angeles', status: 'inactive' },
    ];

    // Find the city by ID
    this.cityData = dummyData.find(city => city.id === id);
  }

  createForm(): void {
    // Initialize the form with the existing city data
    this.cityForm = this.fb.group({
      cname: [this.cityData?.cname, [Validators.required]],
      status: [this.cityData?.status, [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.cityForm.valid) {
      // Update the city data (you can send it to your API here)
      const updatedCity = this.cityForm.value;
      console.log('Updated City:', updatedCity);

      // Navigate to another page or show a success message
      this.router.navigate(['/cities']);  // Example redirect to cities list
    }
  }
}
