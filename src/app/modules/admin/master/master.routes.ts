import { Route } from '@angular/router';
import { Page404Component } from 'app/modules/sessions/page404/page404.component';
import { AmenitiesComponent } from './amenities/amenities.component';
import { AreaComponent } from './area/area.component';
import { InventoryComponent } from './inventory/inventory.component';
import { PropertyTypeComponent } from './property-type/property-type.component';
import { CityComponent } from './city/city.component';
import { PropertySubtypeComponent } from './property-subtype/property-subtype.component';
import { PropertyInventoryComponent } from './property-inventory/property-inventory.component';
import { ImagePreviewDialogComponent } from './image-preview-dialog/image-preview-dialog.component';
import { EditAmenityComponent } from './edit-amenity/edit-amenity.component';
import { EditAreaComponent } from './edit-area/edit-area.component';
import { EditCityComponent } from './edit-city/edit-city.component';
import { EditInventoryComponent } from './edit-inventory/edit-inventory.component';
import { EditPropertyInventoryComponent } from './edit-property-inventory/edit-property-inventory.component';
import { EditPropertySubtypeComponent } from './edit-property-subtype/edit-property-subtype.component';
import { EditPropertyTypeComponent } from './edit-property-type/edit-property-type.component';
import { AddPropertyTypeComponent } from './add-property-type/add-property-type.component';
import { AddCityComponent } from './add-city/add-city.component';
import { AddInventoryComponent } from './add-inventory/add-inventory.component';
import { AddAreaComponent } from './add-area/add-area.component';
import { AddPropertySubtypeComponent } from './add-property-subtype/add-property-subtype.component';
import { AddAmenityComponent } from './add-amenity/add-amenity.component';


export const MASTER_ROUTE: Route[] = [
  {
    path: '',
    redirectTo: 'property-type',
    pathMatch: 'full',
  },
  {
    path: 'amenities',
    component: AmenitiesComponent,
  },
  {
    path: 'add-amenities',
    component: AddAmenityComponent,
  },
  {
    path: 'edit-amenities',
    component: EditAmenityComponent,
  },
  {
    path: 'city',
    component: CityComponent,
  },
  {
    path: 'add-city',
    component: AddCityComponent,
  },
  {
    path: 'edit-city',
    component: EditCityComponent,
  },
  {
    path: 'area',
    component: AreaComponent,
  },
  {
    path: 'edit-area',
    component: EditAreaComponent,
  },
  {
    path: 'add-area',
    component: AddAreaComponent,
  },
  {
    path: 'inventory',
    component: InventoryComponent,
  },
  {
    path: 'add-inventory',
    component: AddInventoryComponent,
  },
  {
    path: 'edit-inventory',
    component: EditInventoryComponent,
  },
  {
    path: 'property-type',
    component: PropertyTypeComponent,
  },
  { 
    path: 'edit-property-type/:id',
    component: EditPropertyTypeComponent
  },
  {
    path: 'property-subtype',
    component: PropertySubtypeComponent,
  },
  {
    path: 'add-property-subtype',
    component: AddPropertySubtypeComponent,
  },
  {
    path: 'edit-property-subtype/:id',
    component: EditPropertySubtypeComponent,
  },
  {
    path: 'edit-property-inventory',
    component: EditPropertyInventoryComponent,
  },
  {
    path: 'add-property-type',
    component: AddPropertyTypeComponent,
  },
  {
    path: 'img-dialog',
    component: ImagePreviewDialogComponent,
  },
  { path: '**', component: Page404Component },
];
