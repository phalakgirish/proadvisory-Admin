import { Component } from '@angular/core';
import {
  FormBuilder,
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
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
@Component({
  selector: 'app-add-packages',
  imports: [
    PageHeaderComponent,
    FormsModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatButtonModule
],
  templateUrl: './add-packages.component.html',
  styleUrl: './add-packages.component.scss'
})
export class AddPackagesComponent {
  bookingForm: FormGroup;
  constructor(private fb: FormBuilder, private http: HttpClient,private snackBar: MatSnackBar) {
    this.bookingForm = this.fb.group({
      packageName: [''],
      cost: [''],
      description: [''],
      status: ['']
    });
  }
  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  onSubmit() {
    console.log('Form Value', this.bookingForm.value);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post('http://localhost:3000/package', this.bookingForm.value, { headers })
      .subscribe(
        response => {
          // console.log('Form submitted successfully:', response);
          this.showNotification(
            'snackbar-danger',
            'Package Created Successfully...!!!',
            'bottom',
            'center'
          );
        },
        error => {
          console.error('Error submitting form:', error);
        }
      );
  }
  
}
