import { CommonModule } from '@angular/common';
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
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-edit-user',
  imports: [PageHeaderComponent,
    FormsModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit {
  userForm: FormGroup = this.fb.group({
    staffId: ['', [Validators.required]],
    name: ['', [Validators.required]],
    userType: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    status: ['', [Validators.required]]
  });
  
  hide: boolean = true;
  userTypes = [
    { value: 'admin', viewValue: 'Admin' },
    { value: 'user', viewValue: 'User' },
    { value: 'manager', viewValue: 'Manager' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Initialize form group
    this.userForm = this.fb.group({
      staffId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      userType: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });
  }

  // Method to handle form submission
  onSubmit(): void {
    if (this.userForm.valid) {
      // Process the form values
      console.log('Form Submitted', this.userForm.value);
      // You can implement form submission logic here (e.g., HTTP request)
    }
  }
}