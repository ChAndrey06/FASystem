import { Component, Inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { Observable, takeUntil, tap } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';

import { DestroyService } from '@core/services';
import { AccountsState } from '@features/accounts';
import { Loadable } from '@core/helpers';
import {
  TransactionCategoryReadInterface,
  TransactionCreateInterface,
  TransactionReadInterface,
  TransactionsService,
  TransactionTypesEnum
} from '@features/transactions';

@Component({
  selector: 'app-transaction-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatIconModule
  ],
  providers: [
    DestroyService
  ],
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements OnInit {
  @Input() typeId: TransactionTypesEnum | null = null;
  @Input() title = 'Transaction';
  accounts$ = this.accountsState.data$;
  categories = new Loadable<TransactionCategoryReadInterface[]>([], false);
  transaction = new Loadable<TransactionReadInterface | null>(null, false);
  transactionTypes = [{
    id: TransactionTypesEnum.expense,
    name: 'Expense'
  }, {
    id: TransactionTypesEnum.income,
    name: 'Income'
  }]

  formGroup: FormGroup = this.formBuilder.group({
    amount: [null, Validators.required],
    description: [null, [Validators.required, Validators.maxLength(500)]],
    typeId: [null, Validators.required],
    categoryId: [null],
    categoryName: [null, [Validators.required]],
    accountId: [null, [Validators.required]]
  });

  constructor(
    @Inject(DestroyService) private readonly viewDestroyed$: Observable<void>,
    private readonly formBuilder: FormBuilder,
    private readonly transactionsService: TransactionsService,
    private readonly accountsState: AccountsState,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      if (isNaN(Number(id))) {
        this.router.navigate(['./']);
      } else {
        this.loadTransaction(Number(id));
      }
    }

    this.resetForm();
    this.loadCategories();

    if (!this.typeId) {
      this.subscribeToTypeId();
    }
    this.subscribeToCategoryName();
  }

  onSubmit(form: any): void {
    if (this.transaction.data) {
      this.updateTransaction(this.transaction.data.id, form);
    } else {
      this.createTransaction(form);
    }
  }

  onNewClicked(): void {
    this.resetForm();
    this.transaction.setData(null);
  }

  onViewAllClicked(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  onClearCategoryClicked(): void {
    this.resetCategory();
  }

  onCategoryNameChanged(): void {
    this.formGroup.patchValue({ categoryId: null });
  }

  onCategorySelected(event: MatAutocompleteSelectedEvent): void {
    const c = event.option.value;
    this.formGroup.patchValue({ categoryId: c.id, categoryName: c.name });
  }

  loadCategories(filter?: string): void {
    const typeId = this.typeId || this.formGroup.value.typeId;
    this.categories.isLoading = true;
    this.transactionsService.getCategories(typeId, filter)
      .pipe(takeUntil(this.viewDestroyed$))
      .subscribe({
        next: data => this.categories.setData(data),
        error: error => this.categories.setError(error)
      });
  }

  loadTransaction(id: number): void {
    this.transaction.isLoading = true;
    this.transactionsService.getById(id)
      .pipe(takeUntil(this.viewDestroyed$))
      .subscribe(t => {
        this.transaction.setData(t);
        this.formGroup.reset(t);
      });
  }

  createTransaction(t: TransactionCreateInterface): void {
    this.transaction.isLoading = true;
    this.transactionsService.create(t)
      .pipe(takeUntil(this.viewDestroyed$))
      .subscribe(t => {
        this.transaction.setData(t);
        this.formGroup.reset(t);
      });
  }

  updateTransaction(id: number, t: TransactionCreateInterface): void {
    this.transaction.isLoading = true;
    this.transactionsService.updateById(id, t)
      .pipe(takeUntil(this.viewDestroyed$))
      .subscribe(t => {
        this.transaction.setData(t);
        this.formGroup.reset(t);
      });
  }

  resetForm(): void {
    this.formGroup.reset({ typeId: this.typeId });
  }

  resetCategory(): void {
    this.formGroup.patchValue({ categoryId: null, categoryName: null });
  }

  subscribeToTypeId(): void {
    this.formGroup.get('typeId')?.valueChanges
      .subscribe(() => {
        this.resetCategory();
        this.loadCategories();
      });
  }

  subscribeToCategoryName(): void {
    const categoryNameFC = this.formGroup.get('categoryName');

    categoryNameFC?.valueChanges
      .pipe(takeUntil(this.viewDestroyed$))
      .subscribe(value => this.loadCategories(value));
  }
}