import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { ImagePreviewDialogComponent } from '../image-preview-dialog/image-preview-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FeatherComponent } from 'angular-feather';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { CurdService } from 'app/services/curd.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InventoryDetailDialogComponent } from '../../property/inventory-detail-dialog/inventory-detail-dialog.component';

interface Property {
  _id: string;
  propertyName: string;
  reraNumber: string;
  city: string;
  area: string;
  pincode: string;
  propertySubType: string;
  bedNo: number;
  carpetArea: string;
  floor: string;
  inventory: string;
  amenities: string;
  possessionDate: any;
  uploadFile: string;
  minPrice: number; 
  maxPrice: number; 
  pricePerSqFt: number; 
  mapLink: string;
  advisorName: string;
  description: string;
  propertyStatus: string;
  propertyType: string;
}

interface PropertyInventory {
  _id?: string; 
  property?: string; 
  inventory?: string; 
  buildUpArea?: number; 
  carpetArea?: number; 
  minPrice: number; 
  maxPrice: number; 
  floorPlan?: string; 
}


interface Inventory {
  carpetArea: number;
  minPrice: number;
  maxPrice: number;
  uploadFile: string;
  builtUpArea:string;
  inventoryName: string;
  _id?: string; 
  propertyName : string;
}

@Component({
  selector: 'app-property-inventory',
  imports: [
    CommonModule,
    PageHeaderComponent,
    FormsModule,
    MatCardModule,
    FileUploadComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatCheckboxModule,
    FeatherIconsComponent,


  ],
  templateUrl: './property-inventory.component.html',
  styleUrl: './property-inventory.component.scss'
})
export class PropertyInventoryComponent implements OnInit {


  inventoryForm: FormGroup;

  dataSource = new MatTableDataSource<Inventory>([]);
  displayedColumns: string[] = [
    'propertyName', // Updated to propertyName,
    'inventoryName',
    'carpetArea',
    'buildUpArea',
    'minPrice',
    'maxPrice',
    'floorPlan',
    'actions',
  ];
  selection = new SelectionModel<Inventory>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;



  inventoryOptions: any;
  propertyOptions:any;
  propertyInventoryOptions:any;

  constructor(private fb: FormBuilder, private dialog: MatDialog, private curdService: CurdService
    ,private snackBar: MatSnackBar,
  ) {
    this.inventoryForm = this.fb.group({
      propertyName: ['', Validators.required],
      inventory: ['', Validators.required],
      carpetArea: [null, [Validators.min(1)]],
      builtUpArea: [null, [Validators.min(1)]],
      minPrice: [null, [Validators.min(1000)]],
      maxPrice: [null, [Validators.min(1000)]],
      uploadFile: [null]
    });
    
  }

  ngOnInit(): void {

    this.fetchProperty();
    this.fetchInventory(); // Fetch existing inventories
    this.fetchInventories();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  

  fetchInventory(): void {
    this.curdService.getData<Inventory[]>('inventories').subscribe({
      next: (inventories) => {
        console.log(inventories);
        this.inventoryOptions = inventories;
      },
      error: () => {
        this.showSnackBar('Failed to load inventory.');
      },
    });
  }

  fetchProperty(): void {
    this.curdService.getData<Property[]>('properties').subscribe({
      next: (properties) => {
        console.log(properties);
        this.propertyOptions = properties;
        // this.dataSource=properties;
      },
      error: () => {
        this.showSnackBar('Failed to load inventory.');
      },
    });
  }

  fetchInventories(): void {
    this.curdService.getData<PropertyInventory[]>('property-inventory').subscribe({
      next: (propertyinventories) => {
        console.log('Fetched Property Inventories:', propertyinventories);
        
        // Fetch property and inventory names before mapping
        this.curdService.getData<Property[]>('properties').subscribe({
          next: (properties) => {
            this.curdService.getData<Inventory[]>('inventories').subscribe({
              next: (inventories) => {
                // Map property and inventory names to their corresponding IDs
                this.propertyOptions = properties;
                this.inventoryOptions = inventories;
  
                this.propertyInventoryOptions = propertyinventories.map((pi) => ({
                  ...pi,
                  propertyName: this.getPropertyNameById(pi.property),
                  inventoryName: this.getInventoryNameById(pi.inventory),
                }));
  
                // Assign updated data to dataSource
                this.dataSource = new MatTableDataSource(this.propertyInventoryOptions);
  
                // Apply paginator and sort
                setTimeout(() => {
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
                });
              },
              error: (err) => {
                console.error('Error fetching inventories:', err);
                this.showSnackBar('Failed to load inventory data.');
              },
            });
          },
          error: (err) => {
            console.error('Error fetching properties:', err);
            this.showSnackBar('Failed to load property data.');
          },
        });
      },
      error: (err) => {
        console.error('Error fetching Property inventories:', err);
        this.showSnackBar('Failed to load Property inventories.');
      },
    });
  }
  
  
  getPropertyNameById(propertyId: string | undefined): string {
    const property = this.propertyOptions?.find((p: Property) => p._id === (propertyId as string));
    return property ? property.propertyName : '-';
  }
  
  
  
  getInventoryNameById(inventoryId?: string): string {
    if (!inventoryId) {
      return '-'; // Fallback if inventoryId is undefined
    }
    const inventory = this.inventoryOptions?.find((inv: Inventory) => inv._id === inventoryId);
    return inventory ? inventory.inventoryName : '-';
  }
  
  
  
  onSubmit(): void {
    if (this.inventoryForm.valid) {
      const formData = this.inventoryForm.value;
  
      const newInventory: PropertyInventory = {
        property: formData.propertyName, // Send ID, not name
        inventory: formData.inventory, // Send ID, not name
        carpetArea: formData.carpetArea,
        buildUpArea: formData.builtUpArea,
        minPrice: formData.minPrice,
        maxPrice: formData.maxPrice,
        floorPlan: formData.uploadFile,
      };
  
      console.log('Submitted Form Data:', newInventory);
  
      this.curdService.postData<PropertyInventory>('property-inventory', newInventory).subscribe(
        (response) => {
          this.dataSource.data = [...this.dataSource.data, response];
          this.inventoryForm.reset();
          this.fetchInventories(); // Reload data after submission
          this.showSnackBar('Inventory added successfully!');
        },
        (error) => {
          console.error('Error creating inventory:', error);
          this.showSnackBar('Failed to create inventory.');
        }
      );
    }
  }
  

  applyPagination(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    
    // Ensure nested object properties like propertyName and inventoryName are included in the filter
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const propertyName = data.property?.propertyName ? data.property.propertyName.toLowerCase() : '';
      const inventoryName = data.inventory?.inventoryName ? data.inventory.inventoryName.toLowerCase() : '';
      const carpetArea = data.carpetArea ? data.carpetArea.toString() : '';
      const buildUpArea = data.buildUpArea ? data.buildUpArea.toString() : '';
      const minPrice = data.minPrice ? data.minPrice.toString() : '';
      const maxPrice = data.maxPrice ? data.maxPrice.toString() : '';
  
      return (
        propertyName.includes(filter) ||
        inventoryName.includes(filter) ||
        carpetArea.includes(filter) ||
        buildUpArea.includes(filter) ||
        minPrice.includes(filter) ||
        maxPrice.includes(filter)
      );
    };
  
    this.dataSource.paginator?.firstPage(); // Reset to first page after filtering
  }
  
  

  delete(row: any): void {
    const inventoryName =
      typeof row.inventory === 'string'
        ? 'Unknown Inventory'
        : row.inventory?.inventoryName || 'Unknown Inventory';
  
    if (confirm(`Are you sure you want to delete inventory for ${inventoryName}?`)) {
      this.curdService.deleteData(`property-inventory/${row._id}`).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(
            (item) => item._id !== row._id
          );
          this.showSnackBar('Inventory deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting inventory:', err);
          this.showSnackBar('Failed to delete inventory.');
        },
      });
    }
  }
  

  

  editCall(row: Inventory): void {
    const index = this.dataSource.data.indexOf(row);
    if (index >= 0) {
      this.inventoryForm.patchValue(row);
      this.dataSource.data.splice(index, 1);
      this.dataSource.data = [...this.dataSource.data];
    }

    // To send update to the API
    this.curdService.updateData<Inventory>(`inventory/${row._id}`, this.inventoryForm.value).subscribe(
      response => {
        // Handle the response as needed
      },
      error => {
        console.error('Error updating inventory:', error);
      }
    );
  }

  // viewImage(row: PropertyInventory): void {
  //   if (row.floorPlan) {
  //     this.dialog.open(ImagePreviewDialogComponent, {
  //       data: { imageUrl: row.floorPlan }
  //     });
  //   }
  // }

  viewImage(row: PropertyInventory): void {
    if (row.floorPlan) {
      this.dialog.open(ImagePreviewDialogComponent, {
        data: { imageUrl: row.floorPlan }
      });
    }
  }
  

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  pageEvent(event: PageEvent): void {
    this.dataSource.paginator!.pageIndex = event.pageIndex;
    this.dataSource.paginator!.pageSize = event.pageSize;
    this.dataSource._updateChangeSubscription();
  }
  
    showSnackBar(message: string) {
      this.snackBar.open(message, 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    }

    viewInventory(row: Inventory): void {
      this.curdService.getData<Inventory[]>('inventories').subscribe({
        next: (allInventories) => {
          console.log("All inventories fetched:", allInventories); // Log all fetched inventories
          const relatedInventories = allInventories.filter(
            (inventory) => inventory.propertyName === row.propertyName
          );
          console.log("Related inventories:", relatedInventories); // Log filtered inventories
          this.dialog.open(InventoryDetailDialogComponent, {
            width: '600px',
            data: {
              propertyName: row.propertyName,
              inventories: relatedInventories,
            },
          });
        },
        error: (error) => {
          console.error('Error fetching inventories:', error);
          this.showSnackBar('Failed to load related inventories.');
        },
      });
    }

      refresh() {
      throw new Error('Method not implemented.');
      }
}