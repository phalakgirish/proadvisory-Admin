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
export class AddStaffComponent {
  staffForm: FormGroup;
  hide = true;
  constructor(private fb: FormBuilder) {
    this.staffForm = this.fb.group({
      name: ['', [Validators.required]],
      usertype: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      email: ['', [Validators.required]],
    //  password:['',[Validators.required]],
      date: ['', [Validators.required]],
    //  address: ['', [Validators.required]],
    //  uploadFile: [''],
    //  note: [''],
    });
  }
  onSubmit() {
    console.log('Form Value', this.staffForm.value);
  }
}
