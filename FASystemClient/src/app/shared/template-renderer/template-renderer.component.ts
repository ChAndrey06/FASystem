import { CommonModule } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-template-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container 
      [ngTemplateOutlet]="template"
      [ngTemplateOutletContext]="templateContext"]
    >
    </ng-container>
    `
})
export class TemplateRendererComponent implements ICellRendererAngularComp {
  template: any;
  templateContext!: { $implicit: any, params: any };

  agInit(params: any): void {
    this.template = params.template;

    this.templateContext = {
      $implicit: params.data,
      params: params
    };
  }

  refresh(): boolean {
    return false;
  }
}
