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
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { CurdService } from 'app/services/curd.service';


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
  staffId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private curdService: CurdService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.staffId = this.route.snapshot.paramMap.get('id') || '';

    if (this.staffId) {
      this.getStaffDetails(this.staffId);
    }
  }

  createForm(): void {
    this.staffForm = this.fb.group({
      Name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      userType: ['', [Validators.required]],
      MobileNo: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10}$'), // 10-digit mobile number
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email, // Email format validation
        ],
      ],
      joiningDate: ['', Validators.required],
    });
  }

  getStaffDetails(id: string): void {
    this.curdService.getData<any>(`staff/${id}`).subscribe({
      next: (res) => {
        if (res) {
          this.staffForm.patchValue(res); // Populate form with fetched data
        }
      },
      error: () => {
        this.showSnackBar('Failed to load staff details.');
      },
    });
  }

  onSubmit(): void {
    if (this.staffForm.valid) {
      this.curdService
        .updateData(`staff/${this.staffId}`, this.staffForm.value)
        .subscribe({
          next: () => {
            this.showSnackBar('Staff details updated successfully!');
            this.router.navigate(['/staffs/all-staffs']);
          },
          error: () => {
            this.showSnackBar('Failed to update staff details.');
          },
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['/staffs/all-staffs']);
  }

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}