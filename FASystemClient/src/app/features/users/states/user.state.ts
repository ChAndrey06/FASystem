import { Injectable } from '@angular/core';

import { ObjectState, NgxState } from 'ngx-base-state';

import { UserInterface } from '../interfaces';

@NgxState()
@Injectable({
  providedIn: 'root'
})
export class UserState extends ObjectState<UserInterface> {  }
