
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { MatSliderChange, MatSliderModule } from '@angular/material/slider';
import { SliderComponent } from 'app/modules/material/slider/slider.component';
import { CommonModule } from '@angular/common';
import { MultipleFileUploadComponent } from '@shared/components/multiple-file-upload/multiple-file-upload.component';
import { CurdService } from 'app/services/curd.service';
import { MatTableDataSource } from '@angular/material/table';
import { City } from 'app/interfaces/city';

interface Property {
  _id:string;
  propertyName: string;
  reraNumber: string;
  city: string;
  area: string;
  pincode: string;
  propertySubType: string;
  bedNo: number;
  carpetArea: string;
  floor: string;
  inventory: string;
  amenities: string;
  possessionDate: any;
  uploadFile: string;
  price: number;
  mapLink: string;
  advisorName: string;
  description: string;
  propertyStatus: string;
  propertyType: string;
}

interface Area {
  areaId: string;
  areaName: string;
  cityName:any;
}

interface PropertyType {
  ptId: string;
  ptName: string;
  status:any;
}

interface PropertySubType {
  pstId: string;
  ptName: string;
  pstName:string;
  status:any;
}

interface Amenity
{
  id:string;
  amenityName:string;
}

interface Inventory
{
  id:string;
  inventoryName:string;
}

interface Advisor
{
  id:string;
  name:string;
  MobileNo:string,
  email:string
}

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

export class AddPropertyComponent implements OnInit {
  propertyForm: FormGroup;
  priceControl: FormControl;
  bedNumbers = [1, 2, 3, 4, 5];
  propertyStatuses = ['Available', 'Sold', 'Under Construction'];


  Area:any;
  cityOptions:any;
  areaOptions:any;
  ptOptions: any;
  pstOptions:any;
  amenitiesOptions:any;
  inventoryOptions:any;
  AdvisorOptions:any;

  submitted = false;
  success_msg = false;
  success_msg_txt = '';
  err_message = '';
  dataSource = new MatTableDataSource<Property>(); // Initialize dataSource


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private curdService: CurdService
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
      price: this.priceControl,
      mapLink: ['', Validators.required],
      advisorName: ['', Validators.required],
      description: ['', Validators.required],
      propertyStatus: ['', Validators.required],
      propertyType: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getPropertyList(); // Load property list on initialization
    this.fetchCities();
    this.fetchAreas();
    this.fetchPropertyTypes();
    this.fetchPropertySubTypes();
    this.fetchAmenities();
    this.fetchInventory();
    this.fetchAdvisor();
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
    console.log('Files selected:', files);

  }

  getPropertyList(): void {
    this.curdService.getData<Property[]>('properties').subscribe({
      next: (properties) => {
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
          this.cityOptions = city;
        },
        error: () => {
          this.showSnackBar('Failed to load properties.');
        }
      })
    }

    fetchAreas():void{
      this.curdService.getData<Area[]>('areas').subscribe({
        next: (area) => {
          this.areaOptions = area;
        },
        error: () => {
          this.showSnackBar('Failed to load areas.');
        }
      })
    }

    fetchPropertyTypes():void{
      this.curdService.getData<PropertyType[]>('property-types').subscribe({
        next: (pt) => {
          this.ptOptions = pt;
  
        },
        error: () => {
          this.showSnackBar('Failed to load property type.');
        }
      })
    }

    fetchPropertySubTypes():void{
      this.curdService.getData<PropertySubType[]>('property-subtypes').subscribe({
        next: (pst) => {
          this.pstOptions = pst;
  
        },
        error: () => {
          this.showSnackBar('Failed to load property subtype.');
        }
      })
    }
    fetchAmenities():void{
      this.curdService.getData<Amenity[]>('amenities').subscribe({
        next: (amenities) => {
          this.amenitiesOptions = amenities;
        },
        error: () => {
          this.showSnackBar('Failed to load property subtype.');
        }
      })
    }

    fetchInventory(): void {
      this.curdService.getData<Inventory[]>('inventories').subscribe({
        next: (inventories) => {
          console.log(inventories);
          this.inventoryOptions = inventories;
        },
        error: () => {
          this.showSnackBar('Failed to load inventory.');
        },
      });
    }
  
    fetchAdvisor(): void {
      this.curdService.getData<Advisor[]>('staff').subscribe({
        next: (staff) => {
          console.log(staff);
          this.AdvisorOptions = staff;
        },
        error: () => {
          this.showSnackBar('Failed to load advisor.');
        },
      });
    }
  
    onSubmit() {
      console.log();
      console.log('Form Submitted!');
      this.submitted = true;
  
      if (this.propertyForm.invalid) {
        console.log('Form is invalid:', this.propertyForm.errors);
        return;
      }
  
      this.curdService.postData('properties', this.propertyForm.value).subscribe({
        next: (res: any) => {
          if (res) {
            console.log('API Success:', res);
            this.success_msg = true;
            this.submitted = false;
            this.propertyForm.reset();
            this.success_msg_txt = 'Property Added Successfully';
            setTimeout(() => {
              this.success_msg = false;
              this.success_msg_txt = '';
            }, 3000);
            this.getPropertyList();
          } else {
            this.err_message = res.message || 'Unknown error occurred.';
            setTimeout(() => {
              this.err_message = '';
            }, 3000);
          }
        },
        error: (err) => {
          console.error('API Error:', err);
          this.err_message = err?.error?.message || 'Something went wrong. Please try again.';
          setTimeout(() => {
            this.err_message = '';
          }, 3000);
        },
        complete: () => {
          console.log('Request completed');
        },
      });
    }
  
    showSnackBar(message: string) {
      this.snackBar.open(message, 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    }
  }