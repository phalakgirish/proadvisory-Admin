import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import {
  MAT_DATE_LOCALE,
  MatOptionModule,
  MatRippleModule,
} from '@angular/material/core';
import { MatMenuTrigger, MatMenuModule } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { TableExportUtil, LocalStorageService, rowsAnimation } from '@shared';
import { NgClass, DatePipe, CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { AllStaffService } from './all-staffs.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { CurdService } from 'app/services/curd.service';

interface Staff {
  _id?: string; 
  Name: string; 
  MobileNo: string; 
  email: string; 
  userType: string; 
  joiningDate: string; 

}


@Component({
    selector: 'app-all-staff',
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
    animations: [rowsAnimation],
    imports: [
        PageHeaderComponent,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatSelectModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        MatOptionModule,
        MatCheckboxModule,
        MatTableModule,
        MatSortModule,
        FeatherIconsComponent,
        MatRippleModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatPaginatorModule,
  
    ],
    templateUrl: './all-staffs.component.html',
    styleUrls: ['./all-staffs.component.scss']
})
export class AllStaffsComponent implements OnInit {
  displayedColumns: string[] = [
    'Name',
    'MobileNo',
    'email',
    'userType',
    'joiningDate',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private curdService: CurdService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchStaff();
  }

  fetchStaff(): void {
    this.curdService.getData<any[]>('staff').subscribe({
      next: (res) => {
        this.dataSource.data = res;
        this.dataSource.paginator = this.paginator;
      },
      error: () => {
        this.showSnackBar('Failed to load staff data. Please try again.');
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  addNew(): void {
    this.router.navigate(['/staffs/add-staff']);
  }

  editCall(row: any): void {
    this.router.navigate(['/staffs/edit-staff', row._id]);
  }

  deleteItem(row: any): void {
    if (confirm('Are you sure you want to delete this staff member?')) {
      this.curdService.deleteData(`staff/${row._id}`).subscribe({
        next: () => {
          this.showSnackBar('Staff deleted successfully!');
          this.fetchStaff(); // Refresh after deletion
        },
        error: () => {
          this.showSnackBar('Failed to delete staff. Please try again.');
        },
      });      
    }
  }

  getDisplayedColumns(): string[] {
    return this.displayedColumns;
  }

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}