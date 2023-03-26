import { Component, Inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { takeUntil, Observable } from 'rxjs';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AuthService, UserInterface } from '@features/users';
import { DestroyService } from '@core/services';
import { AccountInterface } from '@features/accounts';
import { AccountsComponent } from './accounts';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,

    MatToolbarModule,
    MatIconModule,
    MatButtonModule,

    AccountsComponent
  ],
  providers: [
    DestroyService
  ],
  templateUrl: 'toolbar.component.html',
  styleUrls: [
    'toolbar.component.scss'
  ]
})
export class ToolbarComponent {
  @Input() user: UserInterface | null = null;
  @Input() accounts: AccountInterface[] | null = [];

  constructor(
    @Inject(DestroyService) private readonly viewDestroyed$: Observable<void>,
    private readonly router: Router,
    private readonly authService: AuthService
  ) { }

  onLoginClicked() {
    this.router.navigate(['login']);
  }

  onLogoutClicked() {
    this.authService.logout()
      .pipe(takeUntil(this.viewDestroyed$))
      .subscribe(() => { });

    // window.location.href = './';
  }

  get isLoggedIn() {
    return this.user != null;
  }
}
