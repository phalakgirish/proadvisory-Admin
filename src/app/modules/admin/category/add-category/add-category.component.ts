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
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import {Editor, Toolbar, NgxEditorModule } from 'ngx-editor';

@Component({
  selector: 'app-add-category',
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
        NgxEditorModule,
              CKEditorModule,
    ],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss'
})
export class AddCategoryComponent {
  departmentForm: FormGroup;
 
   editor?: Editor;
    content =
      "Enter Service Descriptions";
    public Editor: any = ClassicEditor;
    toolbar: Toolbar = [
      ['bold', 'italic'],
      ['underline', 'strike'],
      ['code', 'blockquote'],
      ['ordered_list', 'bullet_list'],
      [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
      ['link', 'image'],
      ['text_color', 'background_color'],
      ['align_left', 'align_center', 'align_right', 'align_justify'],
    ];
  constructor(private fb: FormBuilder) {
    this.departmentForm = this.fb.group({
      hod: ['', [Validators.required]],
      dName: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      email: ['', [Validators.required]],
      fileUpload: ['', [Validators.required]],
      note: [''],
    });
  }
  onSubmit() {
    console.log('Form Value', this.departmentForm.value);
  }
}
