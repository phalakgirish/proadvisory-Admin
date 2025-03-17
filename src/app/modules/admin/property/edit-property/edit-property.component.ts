
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { MatSliderModule } from '@angular/material/slider';
import { SliderComponent } from 'app/modules/material/slider/slider.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-edit-property',
  imports: [CommonModule,
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
    MatCheckboxModule,MatSliderModule],
  templateUrl: './edit-property.component.html',
  styleUrl: './edit-property.component.scss'
})
export class EditPropertyComponent implements OnInit {
  propertyForm: FormGroup;
  priceControl: FormControl;
  propertyId: string | null = null; // Store property ID for updating

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.priceControl = new FormControl(100000, [
      Validators.required,
      Validators.min(100000),
      Validators.max(10000000)
    ]);

    this.propertyForm = this.fb.group({
      propertyName: ['', Validators.required],
      reraNumber: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      propertyType: ['', Validators.required],
      possessionDate: ['', Validators.required],
      price: this.priceControl
    });
  }
  

  ngOnInit() {
    const propertyData = history.state.propertyData;

    if (propertyData) {
      this.propertyId = propertyData.id; // Store the ID for updating
      this.propertyForm.patchValue({
        propertyName: propertyData.propertyName,
        reraNumber: propertyData.reraNumber,
        city: propertyData.city,
        pincode: propertyData.pincode,
        propertyType: propertyData.propertyType,
        possessionDate: propertyData.possessionDate,
        price: propertyData.price
      });
      console.log('propertyType from API:', propertyData.propertyType);

    } else {
      this.router.navigate(['/property/all-property']); // Redirect if no data
    }
  }

  updatePrice(event: any) {
    this.priceControl.setValue(event.target.value);
  }

  showNotification(colorName: string, text: string) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: colorName,
    });
  }

  onSubmit() {
    if (this.propertyForm.valid && this.propertyId) {
      const formData = this.propertyForm.value;

      this.http.put(`http://localhost:3000/properties/${this.propertyId}`, formData).subscribe(
        () => {
          this.showNotification('snackbar-success', 'Property Updated Successfully!');
          this.router.navigate(['/property/all-property']); // Redirect to property list
        },
        (error: any) => {
          console.error('Error updating property:', error);
          this.showNotification('snackbar-error', 'Failed to update property.');
        }
      );
    } else {
      this.propertyForm.markAllAsTouched();
    }
  }
}