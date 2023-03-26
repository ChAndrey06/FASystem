import { Component, Inject, Input, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { AgGridModule } from 'ag-grid-angular';
import { ColDef, ColumnApi, GridApi, GridReadyEvent, SelectionChangedEvent, ValueFormatterParams } from 'ag-grid-community';

import { Observable, takeUntil } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Loadable } from '@core/helpers';
import { DestroyService } from '@core/services';
import { TemplateRendererComponent } from '@shared';
import { TransactionReadInterface, TransactionsService, TransactionTypesEnum } from '@features/transactions';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,

    AgGridModule,

    MatButtonModule,
    MatIconModule,
  ],
  providers: [
    DestroyService
  ],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent {
  @Input() typeId: TransactionTypesEnum | null = null;
  @Input() title: string = 'Transactions';
  @ViewChild('controlsTemplate', { static: true }) controlsTemplate!: TemplateRef<any>;
  transactions = new Loadable<TransactionReadInterface[] | null>(null, false);
  selected: TransactionReadInterface[] = [];

  gridApi!: GridApi;
  gridColumnApi!: ColumnApi;

  columnDefs!: ColDef[];
  defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true
  };
  gridOptions = {
    suppressRowClickSelection: true,
    rowHeight: 48
  };

  constructor(
    @Inject(DestroyService) private readonly viewDestroyed$: Observable<void>,
    private readonly transactionsService: TransactionsService,
    private readonly router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.setCoumnDefs();
    this.loadTransactions();
  }

  setCoumnDefs(): void {
    this.columnDefs = [
      {
        field: 'id',
        headerCheckboxSelection: true,
        checkboxSelection: true,
      },
      { field: 'amount' },
      { field: 'description' },
      { 
        field: 'categoryName',
        headerName: 'Category'
      },
      { 
        field: 'accountName',
        headerName: 'Account'
      },
      { 
        field: 'typeName',
        headerName: 'Type',
        hide: this.typeId != null
      },
      {
        headerName: 'Controls',
        pinned: 'right',
        cellRenderer: TemplateRendererComponent,
        cellRendererParams: {
          template: this.controlsTemplate
        }
      }
    ]
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onFirstDataRendered(): void {
    this.gridColumnApi.autoSizeAllColumns();
  }

  onSelectionChanged(event: SelectionChangedEvent) {
    this.selected = event.api.getSelectedRows();
  }

  onNewClicked() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onRowClicked(expense: TransactionReadInterface): void {

  }

  onRowEditClicked(transaction: TransactionReadInterface): void {
    this.navigateToDetails(transaction);
  }

  resetSelected(): void {
    this.selected = [];
  }

  loadTransactions(): void {
    this.transactions.isLoading = true;
    this.transactionsService.getAll(this.typeId)
      .pipe(takeUntil(this.viewDestroyed$))
      .subscribe({
        next: data => {
          this.transactions.setData(data);
        },
        error: error => this.transactions.setError(error)
      });
  }

  navigateToDetails(transaction: TransactionReadInterface): void {
    let pageUrl = '';

    switch (transaction.typeId) {
      case TransactionTypesEnum.income: 
        pageUrl = 'incomes';
        break;
      case TransactionTypesEnum.expense: 
        pageUrl = 'expenses';
        break;
    }

    this.router.navigate([pageUrl, transaction.id]);
  }
}
