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
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-city',
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
  templateUrl: './add-city.component.html',
  styleUrl: './add-city.component.scss'
})
export class AddCityComponent implements OnInit {
  cityForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private curdService: CurdService,
    private snackBar: MatSnackBar,
    private router: Router 
  ) {
    this.cityForm = this.fb.group({
      cname: [ '',
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s]*$/)]
      ],
      status: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  onSubmit(): void {
    if (this.cityForm.valid) {
      const newCity: City = this.cityForm.value;

      this.curdService.postData('city', newCity).subscribe({
        next: (response: City) => {
          console.log('City added:', response);

          this.showSnackBar(`City "${response.cname}" added successfully!`);

          setTimeout(() => {
            this.router.navigate(['/master/city']);
          });
        },
        error: (error) => {
          console.error('Error adding city:', error);
          this.showSnackBar('Failed to add city. Please try again.');
        },
      });
    } else {
      this.showSnackBar('Please fill all required fields correctly.');
    }
  }


  addNew(): void {
    this.cityForm.reset();
    this.cityForm.markAsUntouched();
    this.cityForm.markAsPristine();
  }
}
