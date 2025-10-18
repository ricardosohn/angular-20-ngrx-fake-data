import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from './shared/components/app-header/app-header.component';
import { AppSidebarComponent } from './shared/components/app-sidebar/app-sidebar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppHeaderComponent, AppSidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
