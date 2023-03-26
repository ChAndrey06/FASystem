import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsComponent, TransactionTypesEnum } from '@features/transactions';

@Component({
  selector: 'app-incomes',
  standalone: true,
  imports: [
    CommonModule,

    TransactionsComponent
  ],
  templateUrl: './incomes.component.html',
  styleUrls: ['./incomes.component.scss']
})
export class IncomesComponent {
  typeId = TransactionTypesEnum.income;
}