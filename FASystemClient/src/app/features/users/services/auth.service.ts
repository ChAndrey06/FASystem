import { Injectable } from '@angular/core';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { ApiService } from '@core/services';
import { LoginInterface, TokensInterface, UserInterface } from '../interfaces';
import { UserState } from '../states';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ACCESS_TOKEN = 'ACCESS_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';

  constructor(
    private readonly apiService: ApiService,
    private readonly userState: UserState
  ) {}

  public update() {
    return this.apiService.get<UserInterface>('users/me')
      .pipe(
        tap(user => this.userState.set(user)),
        map(() => true),
        catchError(() => of(false))
      );
  }

  public login(login: LoginInterface): Observable<boolean> {
    return this.apiService.post<{ tokens: TokensInterface, user: UserInterface}>('users/login', login)
      .pipe(
        tap(response => this.doLogin(response)),
        map(() => true),
        catchError(() => of(false))
      );
  }

  public logout(): Observable<boolean> {
    const response = this.apiService.post('users/logout', {
      refreshToken: this.getRefreshToken()
    }).pipe(
      map(() => true),
      catchError(() => of(false)),
      finalize(() => this.doLogout())
    );

    return response;
  }
  
  public refreshToken(): Observable<TokensInterface> {
    return this.apiService.post<TokensInterface>('refresh', {
      refreshToken: this.getRefreshToken()
    }).pipe(tap((tokens: TokensInterface) => {
      this.storeAccessToken(tokens.accessToken);
    }));
  }
  
  public get isLoggedIn() {
    return !!this.getAccessToken();
  }

  private doLogin({ user, tokens }: { user: UserInterface, tokens: TokensInterface }): void {
    this.userState.set(user);
    this.storeTokens(tokens);
  }

  private doLogout(): void {
    this.userState.clear();
    this.removeTokens();
  }

  public getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeAccessToken(accessToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN, accessToken);
  }

  private storeTokens(tokens: TokensInterface): void {
    localStorage.setItem(this.ACCESS_TOKEN, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
  }

  private removeTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }
}
