import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { tap } from 'rxjs';

import { ApiService } from '@core/services';
import { AccountsService } from '@features/accounts';
import { TransactionTypesEnum } from '../enums';
import { TransactionCategoryReadInterface, TransactionCreateInterface, TransactionReadInterface } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  constructor(
    private readonly apiService: ApiService,
    private readonly accountsService: AccountsService,
    private router: Router
  ) { }

  public getAll(typeId: TransactionTypesEnum | null) {
    return this.apiService.get<TransactionReadInterface[]>(`transactions?typeId=${typeId || ''}`);
  }

  public getCategories(typeId: TransactionTypesEnum | null, filter?: string) {
    const url = `transactions/categories?transactionTypeId=${typeId || ''}&filter=${filter || ''}`
    return this.apiService.get<TransactionCategoryReadInterface[]>(url);
  }

  public create(transaction: TransactionCreateInterface) {
    return this.apiService.post<TransactionReadInterface>('transactions', transaction)
      .pipe(tap(() => this.accountsService.update().subscribe()));
  }

  public getById(id: number, typeId?: TransactionTypesEnum) {
    const url = `transactions/${id}?typeId=${typeId || ''}`
    return this.apiService.get<TransactionReadInterface>(url.toString());
  }

  public getExpenseById(id: number) {
    return this.getById(id, TransactionTypesEnum.expense);
  }

  public getIncomeById(id: number) {
    return this.getById(id, TransactionTypesEnum.income);
  }

  public updateById(id: number, transaction: TransactionCreateInterface) {
    return this.apiService.put<TransactionReadInterface>(`transactions/${id}`, transaction)
      .pipe(tap(() => this.accountsService.update().subscribe()));
  }
}
