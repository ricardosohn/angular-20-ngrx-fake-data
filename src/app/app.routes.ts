import { Routes } from '@angular/router';
import { routes as productsRoutes } from './features/products/products.routes';

export const routes: Routes = [
  ...productsRoutes,
	{ path: '', pathMatch: 'full', redirectTo: 'products' }
];
