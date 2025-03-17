import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewEncapsulation,
  forwardRef,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-multiple-file-upload',
  imports: [CommonModule,MatButtonModule],
  templateUrl: './multiple-file-upload.component.html',
  styleUrl: './multiple-file-upload.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultipleFileUploadComponent),
      multi: true,
    },
  ],
  
})
export class MultipleFileUploadComponent implements ControlValueAccessor {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  files: File[] = [];
  onChange!: (files: File[]) => void;
  onTouched!: () => void;

  constructor(private host: ElementRef<HTMLInputElement>) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.updateFiles(Array.from(input.files), true); // Append files instead of replacing
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      this.updateFiles(Array.from(event.dataTransfer.files), true);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  updateFiles(files: File[], append: boolean = false) {
    if (append) {
      this.files = [...this.files, ...files]; // Append instead of replace
    } else {
      this.files = files;
    }
    if (this.onChange) {
      this.onChange(this.files);
    }
  }

  writeValue(value: File[] | null) {
    this.files = value || [];
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  registerOnChange(fn: (files: File[]) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  getFileNames(): string {
    return this.files.map(file => file.name).join(', ');
  }
}