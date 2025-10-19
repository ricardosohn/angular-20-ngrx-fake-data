import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState, selectAll as SelectAllProducts } from './product.reducer';

export const PRODUCTS_KEY = 'products';

export const selectProductsState = createFeatureSelector<ProductsState>(PRODUCTS_KEY);

export const selectLoading = createSelector(selectProductsState, (s) => s?.loading ?? false);

export const selectProducts = createSelector(selectProductsState, (s) =>
  s ? SelectAllProducts(s) : []
);
