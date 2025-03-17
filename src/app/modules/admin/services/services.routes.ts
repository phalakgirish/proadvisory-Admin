import { Route } from '@angular/router';
import { Page404Component } from 'app/modules/sessions/page404/page404.component';
import { AllServicesComponent } from './all-services/all-services.component';
import { AddServicesComponent } from './add-services/add-services.component';

export const SERVICES_ROUTE: Route[] = [
  {
    path: '',
    redirectTo: 'all-services',
    pathMatch: 'full',
  },
  {
    path: 'all-services',
    component: AllServicesComponent,
  },
  {
    path: 'add-services',
    component: AddServicesComponent,
  },
  
  { path: '**', component: Page404Component },
];
