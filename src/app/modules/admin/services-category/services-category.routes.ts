import { Route } from '@angular/router';
import { Page404Component } from 'app/modules/sessions/page404/page404.component';
import { AllServicesCategoryComponent } from './all-services-category/all-services-category.component';
import { AddServicesCategoryComponent } from './add-services-category/add-services-category.component';


export const SERVICES_CATEGORY_ROUTE: Route[] = [
  {
    path: '',
    redirectTo: 'all-services-category',
    pathMatch: 'full',
  },
  {
    path: 'all-services-category',
    component: AllServicesCategoryComponent,
  },
  {
    path: 'add-services-category',
    component: AddServicesCategoryComponent,
  },
  
  { path: '**', component: Page404Component },
];
