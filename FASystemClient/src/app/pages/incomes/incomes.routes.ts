import { Route } from '@angular/router';

export const INCOMES_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('.').then((m) => m.IncomesComponent)
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