import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import { AuthService, LoginInterface } from '@features/users';
import { ControlConfigMap } from '@core/helpers';
import { takeUntil } from 'rxjs';
import { DestroyService } from '@core/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatFormFieldModule,
    MatButtonModule,
    MatInputModule
  ],
  providers: [
    DestroyService
  ],
  templateUrl: 'login.component.html',
  styleUrls: [
    'login.component.scss'
  ]
})
export class LoginComponent {
  loginError: boolean = false;
  formGroup: FormGroup = this.formBuilder.group<ControlConfigMap<LoginInterface>>({
    login: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(18)]]
  });

  constructor(
    @Inject(DestroyService) private readonly viewDestroyed$: Observable<void>,
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }

  onLoginSubmit(login: LoginInterface) {
    this.loginError = false;
    this.authService.login(login)
      .pipe(takeUntil(this.viewDestroyed$))
      .subscribe(success => {
        if (success) {          
          window.location.href = './' + (this.route.snapshot.queryParams['returnUrl'] || '');
        } else {
          this.loginError = true;
        }
      });
  }
}