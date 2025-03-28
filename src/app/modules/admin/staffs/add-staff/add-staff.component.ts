import { Component, OnInit } from '@angular/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { CurdService } from 'app/services/curd.service';

@Component({
  selector: 'app-add-staff',
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
  templateUrl: './add-staff.component.html',
  styleUrl: './add-staff.component.scss'
})
export class AddStaffComponent implements OnInit {
  staffForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private curdService: CurdService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.staffForm = this.fb.group({
      Name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z\s]+$/), 
        ],
      ],
      userType: ['', Validators.required],
      MobileNo: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/), 
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      joiningDate: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.staffForm.valid) {
      this.curdService
        .postData('staff', this.staffForm.value)
        .subscribe({
          next: (res) => {
            this.showSnackBar('Staff added successfully!');
            this.router.navigate(['staffs/all-staffs']);
          },
          error: () => {
            this.showSnackBar('Failed to add staff. Please try again.');
          },
        });
    } else {
      this.showSnackBar('Please fill all required fields correctly.');
    }
  }

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  onCancel(): void {
    this.router.navigate(['staffs/all-staff']);
  }
}