import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: FileUploadComponent,
            multi: true,
        },
    ],
    styleUrls: ['./file-upload.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [MatButtonModule]
})
export class FileUploadComponent implements ControlValueAccessor {
  file: File | null = null;
  onChange: (file: File | null) => void = () => {};
  onTouched: () => void = () => {};

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private host: ElementRef<HTMLInputElement>) {}

  // ✅ Handle file change from input safely
  emitFiles(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files.item(0);
      this.file = file;
      this.onChange(this.file);
      this.onTouched();
    }
  }

  // ✅ Handle drag & drop
  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      this.emitFilesFromFileList(event.dataTransfer.files);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.host.nativeElement.querySelector('.file-drop-area')?.classList.add('drag-over');
  }

  onDragLeave(event: DragEvent) {
    this.host.nativeElement.querySelector('.file-drop-area')?.classList.remove('drag-over');
  }

  // ✅ Open file input on button click
  triggerFileInput() {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  // ✅ Handle files for drag & drop
  emitFilesFromFileList(fileList: FileList) {
    if (fileList && fileList.length > 0) {
      const file = fileList.item(0);
      this.file = file;
      this.onChange(this.file);
      this.onTouched();
    }
  }

  // ✅ ControlValueAccessor methods
  writeValue(value: File | null): void {
    this.file = value;
  }

  registerOnChange(fn: (file: File | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}