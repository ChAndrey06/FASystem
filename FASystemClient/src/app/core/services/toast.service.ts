import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(
    private readonly snackBar: MatSnackBar
  ) { }

  public open(message: string) {
    this.snackBar.open(message, 'Ok', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 1000,
      panelClass: 'snackbar'
    });
  }
}
