import { NgModule } from '@angular/core';
import { RouterModule, Routes,Route } from '@angular/router';
import { AddCategoryComponent } from './add-category/add-category.component';
import { AllCategoryComponent } from './all-category/all-category.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { Page404Component } from 'app/modules/sessions/page404/page404.component';

export const CATEGORY_ROUTE: Route[] = [
  {
    path: '',
    redirectTo: 'all-service',
    pathMatch: 'full',
  },
  {
    path: 'all-service',
    component: AllCategoryComponent,
  },
  {
    path: 'add-service',
    component: AddCategoryComponent,
  },
  {
    path: 'edit-service',
    component: EditCategoryComponent,
  },
  { path: '**', component: Page404Component },
];


