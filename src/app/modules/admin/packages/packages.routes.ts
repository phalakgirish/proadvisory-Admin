import { Route } from '@angular/router';
import { Page404Component } from 'app/modules/sessions/page404/page404.component';
import { AllPackagesComponent } from './all-packages/all-packages.component';
import { AddPackagesComponent } from './add-packages/add-packages.component';

export const PACKAGES_ROUTE: Route[] = [
  {
    path: '',
    redirectTo: 'all-packages',
    pathMatch: 'full',
  },
  {
    path: 'all-packages',
    component: AllPackagesComponent,
  },
  {
    path: 'add-packages',
    component: AddPackagesComponent,
  },
  
  { path: '**', component: Page404Component },
];
