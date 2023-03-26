import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guards";
import { TransactionsComponent } from "@features/transactions";

import { MainLayoutComponent } from "./layouts";

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/home').then((m) => m.HomeComponent)
      },
      {
        path: 'login',
        loadComponent: () => import('./pages/login').then((m) => m.LoginComponent)
      },
      {
        path: 'expenses',
        loadChildren: () => import('./pages/expenses').then((m) => m.EXPENSES_ROUTES),
        canActivate: [AuthGuard]
      },
      {
        path: 'incomes',
        loadChildren: () => import('./pages/incomes').then((m) => m.INCOMES_ROUTES),
        canActivate: [AuthGuard]
      },
      {
        path: 'transactions',
        loadComponent: () => import('@features/transactions').then((m) => m.TransactionsComponent),
        canActivate: [AuthGuard]
      },
      { 
        path: 'transactions/new', 
        loadComponent: () => import('@features/transactions').then((m) => m.TransactionDetailsComponent),
        canActivate: [AuthGuard]
      },
      {
        path: '**',
        redirectTo: '___'
      }
    ]
  }
]