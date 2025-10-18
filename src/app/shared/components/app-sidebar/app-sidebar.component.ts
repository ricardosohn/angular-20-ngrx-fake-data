import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  template: `
    <aside class="hidden md:flex md:flex-col h-full border-r border-[rgb(var(--gray-6))]">
      <div class="p-4 border-b border-[rgb(var(--gray-6))]">
        <a class="btn btn-soft btn-block" routerLink="/products">{{ 'appName' | translate }}</a>
      </div>
      <nav class="menu p-2 gap-1">
        <a class="menu-item" routerLink="/products" routerLinkActive="active">{{ 'products' | translate }}</a>
        <a class="menu-item" routerLink="/users" routerLinkActive="active">{{ 'users' | translate }}</a>
      </nav>
    </aside>
  `,
})
export class AppSidebarComponent {}
