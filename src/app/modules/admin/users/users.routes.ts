import { Route } from '@angular/router';
import { Page404Component } from 'app/modules/sessions/page404/page404.component';
import { AllUserComponent } from './all-user/all-user.component';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';

export const USERS_ROUTE: Route[] = [
  {
    path: '',
    redirectTo: 'all-users',
    pathMatch: 'full',
  },
  {
    path: 'all-users',
    component: AllUserComponent,
  },
  {
    path: 'add-user',
    component: AddUserComponent,
  },
  {
    path: 'edit-user',
    component: EditUserComponent,
  },
  {
    path: 'edit-user/:id', // This will allow us to pass a user ID as a route parameter
    component: EditUserComponent,
  },
  { path: '**', component: Page404Component },
];
