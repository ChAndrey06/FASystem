import { Injectable } from '@angular/core';
import { ApiService } from '@core/services';
import { tap } from 'rxjs';
import { AccountInterface } from '../interfaces';

import { AccountsState } from '../states';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  constructor(
    private readonly apiService: ApiService,
    private readonly accountsState: AccountsState
  ) { }

  public update() {
    return this.apiService.get<AccountInterface[]>('accounts')
      .pipe(
        tap(users => this.accountsState.set(users))
      );
  }
}
