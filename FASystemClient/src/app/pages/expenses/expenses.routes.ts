import { Route } from '@angular/router';

export const EXPENSES_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('.').then((m) => m.ExpensesComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./details').then((m) => m.DetailsComponent)
  },
  {
    path: `:id`,
    loadComponent: () => import('./details').then((m) => m.DetailsComponent)
  }
];