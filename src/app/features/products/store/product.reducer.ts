import { createReducer, on } from '@ngrx/store';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Product } from '../models/product.model';
import { ProductActions } from './product.actions';

export interface ProductsState extends EntityState<Product> {
  loading: boolean;
  error: unknown | null;
}

export const entityAdapter = createEntityAdapter<Product>();
export const { selectAll } = entityAdapter.getSelectors();

const initialState: ProductsState = entityAdapter.getInitialState({
  loading: false,
  error: null,
});

export const productsReducer = createReducer(initialState,
  on(ProductActions.loadProducts, state => ({ ...state, loading: true, error: null })),
  on(ProductActions.loadProductsSuccess, (state, { products }) =>
    entityAdapter.setAll(products, { ...state, loading: false })
  ),
  on(ProductActions.loadProductsFailure, (state, { error }) => ({ ...state, loading: false, error }))
);
