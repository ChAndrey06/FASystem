import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { AgGridModule } from 'ag-grid-angular';
import { ColDef, ColumnApi, GridApi, GridReadyEvent, SelectionChangedEvent } from 'ag-grid-community';

import { Observable, takeUntil } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Loadable } from '@core/helpers';
import { DestroyService } from '@core/services';
import { TemplateRendererComponent } from '@shared';
import { TransactionReadInterface, TransactionsService, TransactionTypesEnum } from '@features/transactions';

@Component({
  selector: 'app-expenses',
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
  templateUrl: 'expenses.component.html',
  styleUrls: ['expenses.component.scss']
})
export class ExpensesComponent {
  @ViewChild('controlsTemplate', { static: true }) controlsTemplate!: TemplateRef<any>;
  expenses = new Loadable<TransactionReadInterface[] | null>(null, false);
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
    this.updateExpenses();
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

  onRowEditClicked(expense: TransactionReadInterface): void {
    this.router.navigate([expense.id], { relativeTo: this.route });
  }

  resetSelected(): void {
    this.selected = [];
  }

  updateExpenses(): void {
    this.expenses.isLoading = true;
    this.transactionsService.getAll(TransactionTypesEnum.expense)
      .pipe(takeUntil(this.viewDestroyed$))
      .subscribe({
        next: data => {
          this.expenses.setData(data);
        },
        error: error => this.expenses.setError(error)
      });
  }
}
