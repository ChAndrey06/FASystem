import { Injectable } from '@angular/core';

import { ArrayState, NgxState, ObjectState } from 'ngx-base-state';

import { AccountInterface } from '../interfaces';

@NgxState()
@Injectable({
  providedIn: 'root'
})
export class AccountsState extends ArrayState<AccountInterface> {
  constructor() {
    super(new Array());
  }
}