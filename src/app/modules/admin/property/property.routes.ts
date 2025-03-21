import { Route } from '@angular/router';
import { Page404Component } from 'app/modules/sessions/page404/page404.component';
import { AddPropertyComponent } from './add-property/add-property.component';
import { ViewPropertyComponent } from './view-property/view-property.component';
import { EditPropertyComponent } from './edit-property/edit-property.component';
import { PropertyInventoryComponent } from '../master/property-inventory/property-inventory.component';
import { InventoryDetailDialogComponent } from './inventory-detail-dialog/inventory-detail-dialog.component';

export const PROPERTY_ROUTE: Route[] = [
  {
    path: '',
    redirectTo: 'all-property',
    pathMatch: 'full',
  },
  {
    path: 'add-property',
    component: AddPropertyComponent,
  },
  {
    path: 'all-property',
    component: ViewPropertyComponent,
  },
  {
    path: 'edit-property/:id',
    component: EditPropertyComponent,
},
{
  path: 'property-inventory',
  component: PropertyInventoryComponent,
},
{
  path: 'inventory-detail-dialog',
  component: InventoryDetailDialogComponent,
},

  
  { path: '**', component: Page404Component },
];
