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
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';


@Component({
    selector: 'app-edit-staff',
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
    MatButtonModule,
    CommonModule
],
    templateUrl: './edit-staff.component.html',
    styleUrl: './edit-staff.component.scss'
})
export class EditStaffComponent implements OnInit {
  staffForm!: FormGroup;
  staffData: any; // Define staffData here

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize the form group
    this.staffForm = this.fb.group({
      name: ['', Validators.required],
      usertype: ['', Validators.required],
      mobile: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      date: ['', Validators.required],
    });

    // You would normally get this data from an API or passed as route parameters
    this.loadStaffData();
  }

  loadStaffData(): void {
    // Simulating fetching staff data (you would replace this with an actual API call)
    this.staffData = {
      name: 'John Doe',
      usertype: 'admin',
      mobile: '1234567890',
      email: 'john.doe@example.com',
      date: '2023-03-01',
    };

    // Set the form values to the staff data
    this.staffForm.patchValue(this.staffData);
  }

  onCancel(): void {
    // Navigate back to the previous page or a list of staff
    this.router.navigate(['/staff-list']);
  }

  onSubmit(): void {
    if (this.staffForm.valid) {
      // Handle form submission
      console.log('Staff Data Updated:', this.staffForm.value);
    }
  }
}