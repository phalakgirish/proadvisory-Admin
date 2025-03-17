
import { ChangeDetectorRef, Component } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { MultipleFileUploadComponent } from '@shared/components/multiple-file-upload/multiple-file-upload.component';

@Component({
  selector: 'app-add-property',
  imports: [PageHeaderComponent,
    FormsModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatSelectModule,
    MultipleFileUploadComponent,
    MatOptionModule,
    MatDatepickerModule,
    MatButtonModule,
    MatCheckboxModule,MatSliderModule ],
  templateUrl: './add-property.component.html',
  styleUrl: './add-property.component.scss'
})

export class AddPropertyComponent {
  propertyForm: FormGroup;
  priceControl: FormControl;
  cities = ['City1', 'City2', 'City3']; // Example data for cities
  areas = ['Area1', 'Area2', 'Area3']; // Example data for areas
  propertySubTypes = ['Type1', 'Type2', 'Type3']; // Example data for property subtypes
  bedNumbers = [1, 2, 3, 4, 5]; // Example data for bed numbers
  inventoryList = ['Inventory1', 'Inventory2', 'Inventory3']; // Example data for inventory
  amenitiesList = ['Amenity1', 'Amenity2', 'Amenity3']; // Example data for amenities
  advisorNames = ['Advisor1', 'Advisor2', 'Advisor3']; // Example data for advisor names
  propertyStatuses = ['Available', 'Sold', 'Under Construction']; // Example data for property statuses
  propertyTypes = ['Residential', 'Commercial'];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.priceControl = new FormControl(100000, [
      Validators.required,
      Validators.min(100000),
      Validators.max(10000000),
    ]);

    this.propertyForm = this.fb.group({
      propertyName: ['', Validators.required],
      reraNumber: ['', Validators.required],
      city: ['', Validators.required],
      area: ['', Validators.required],
      pincode: ['', Validators.required],
      propertySubType: ['', Validators.required],
      bedNo: ['', Validators.required],
      carpetArea: ['', Validators.required],
      floor: ['', Validators.required],
      inventory: ['', Validators.required],
      amenities: [''],
      possessionDate: ['', Validators.required],
      uploadFile: [''],
      price: [this.priceControl],
      mapLink: ['', Validators.required],  
      advisorName: ['', Validators.required],  
      description: ['', Validators.required],  
      propertyStatus: ['', Validators.required],  
      propertyType: ['', Validators.required]  
    });
  }
  
  ngOnInit() {
  console.log('Cities:', this.cities);
  console.log('Areas:', this.areas);
  console.log('Property SubTypes:', this.propertySubTypes);
  console.log('Cities:', this.cities);

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

  onFileSelect(event: any) {
    const files = event.target.files;
    if (files.length) {
      this.propertyForm.patchValue({ images: Array.from(files) });
    }
  }

  onSubmit() {
    if (this.propertyForm.valid) {
      const formData = new FormData();
      Object.entries(this.propertyForm.value).forEach(([key, value]) => {
        if (key === 'images') {
          (value as File[]).forEach((file, index) => {
            formData.append(`images[${index}]`, file);
          });
        } else {
          formData.append(key, value as string);
        }
      });

      this.http.post('http://localhost:3000/properties', formData).subscribe(
        () => {
          this.showNotification('snackbar-success', 'Property Created Successfully!');
          this.propertyForm.reset();
        },
        (error: any) => {
          console.error('Error submitting form:', error);
        }
      );
    } else {
      this.propertyForm.markAllAsTouched();
    }
  }
}
