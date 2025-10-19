import { Component } from '@angular/core';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <div class="min-h-[50vh] flex items-center justify-center p-8">
      <div class="alert alert-warning shadow-md max-w-lg flex justify-center">
        <span>{{ 'pageNotFound' | translate }}</span>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}
