import { Routes } from '@angular/router';

export const foodTrackingRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/food-list/food-list.component').then(m => m.FoodListComponent)
  },
  {
    path: 'add',
    loadComponent: () => import('./components/food-entry-form/food-entry-form.component').then(m => m.FoodEntryFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./components/food-entry-form/food-entry-form.component').then(m => m.FoodEntryFormComponent)
  }
];
