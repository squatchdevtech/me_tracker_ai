import { Routes } from '@angular/router';

export const moodTrackingRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/mood-list/mood-list.component').then(m => m.MoodListComponent)
  },
  {
    path: 'calendar',
    loadComponent: () => import('./components/mood-calendar/mood-calendar.component').then(m => m.MoodCalendarComponent)
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
