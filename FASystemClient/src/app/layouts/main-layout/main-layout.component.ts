import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { forkJoin, Observable, takeUntil } from 'rxjs';

import { ToolbarComponent } from '../components';
import { AuthService, UserState } from '@features/users';
import { DestroyService } from '@core/services';
import { AccountsService, AccountsState } from '@features/accounts';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,

    ToolbarComponent
  ],
  providers: [
    DestroyService
  ],
  template: `
    <app-toolbar [user]="user$ | async" [accounts]="accounts$ | async"></app-toolbar>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .container {
      padding-top: 10px;
    }
  `]
})
export class MainLayoutComponent implements OnInit{
  user$ = this.userState.data$;
  accounts$ = this.accountsState.data$;

  constructor(
    @Inject(DestroyService) private readonly viewDestroyed$: Observable<void>,
    private readonly userState: UserState,
    private readonly accountsState: AccountsState,
    private readonly authService: AuthService,
    private readonly accountsService: AccountsService
  ) { }

  ngOnInit(): void {
    forkJoin([  
      this.authService.update(), 
      this.accountsService.update()
    ])
      .pipe(takeUntil(this.viewDestroyed$))
      .subscribe();
  }
}
