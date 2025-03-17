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
    path: 'edit-amenities',
    component: EditAmenityComponent,
  },
  {
    path: 'city',
    component: CityComponent,
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
    path: 'inventory',
    component: InventoryComponent,
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
    path: 'edit-property-type',
    component: EditPropertyTypeComponent,
  },
  {
    path: 'property-subtype',
    component: PropertySubtypeComponent,
  },
  {
    path: 'edit-property-subtype',
    component: EditPropertySubtypeComponent,
  },
  {
    path: 'property-inventory',
    component: PropertyInventoryComponent,
  },
  {
    path: 'edit-property-inventory',
    component: EditPropertyInventoryComponent,
  },
  {
    path: 'img-dialog',
    component: ImagePreviewDialogComponent,
  },
  { path: '**', component: Page404Component },
];
