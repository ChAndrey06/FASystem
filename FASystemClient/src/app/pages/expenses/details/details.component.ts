import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TransactionDetailsComponent,
  TransactionTypesEnum
} from '@features/transactions';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,

    TransactionDetailsComponent
  ],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {
  typeId = TransactionTypesEnum.expense;
}
