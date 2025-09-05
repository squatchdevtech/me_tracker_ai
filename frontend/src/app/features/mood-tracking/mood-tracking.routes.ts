import { Routes } from '@angular/router';

export const moodTrackingRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/mood-list/mood-list.component').then(m => m.MoodListComponent)
  },
  {
    path: 'add',
    loadComponent: () => import('./components/mood-entry-form/mood-entry-form.component').then(m => m.MoodEntryFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./components/mood-entry-form/mood-entry-form.component').then(m => m.MoodEntryFormComponent)
  }
];
