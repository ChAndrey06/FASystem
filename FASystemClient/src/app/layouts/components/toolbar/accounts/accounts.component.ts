import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountInterface } from '@features/accounts';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'accounts.component.html',
  styleUrls: ['accounts.component.scss']
})
export class AccountsComponent {
  @Input() accounts: AccountInterface[] | null = null;
  
}
