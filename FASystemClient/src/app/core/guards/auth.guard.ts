import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@features/users';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(state: RouterStateSnapshot) {
    return this.canLoad(state);
  }

  canLoad(state: RouterStateSnapshot) {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['login'], { queryParams: { returnUrl: state.url }});
    }

    return this.authService.isLoggedIn;
  }
}
