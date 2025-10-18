import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { productsReducer } from './store/product.reducer';
import { PRODUCTS_KEY } from './store/product.selectors';
import { ProductEffects } from './store/product.effect';

export const routes: Routes = [
	{
		path: 'products',
		providers: [
			provideState(PRODUCTS_KEY, productsReducer),
			provideEffects(ProductEffects)
		],
		loadComponent: () => import('./pages/products-page/products-page.component').then(m => m.ProductsPageComponent)
	},
];
