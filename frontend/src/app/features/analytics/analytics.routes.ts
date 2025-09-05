import { Routes } from '@angular/router';

export const analyticsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'correlations',
    loadComponent: () => import('./components/correlations/correlations.component').then(m => m.CorrelationsComponent)
  },
  {
    path: 'trends',
    loadComponent: () => import('./components/trends/trends.component').then(m => m.TrendsComponent)
  },
  {
    path: 'insights',
    loadComponent: () => import('./components/insights/insights.component').then(m => m.InsightsComponent)
  }
];
