import { createReducer, on } from '@ngrx/store';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Product } from '../models/product.model';
import { ProductActions } from './product.actions';

export interface ProductsState extends EntityState<Product> {
  loading: boolean;
}

export const entityAdapter = createEntityAdapter<Product>();
export const { selectAll } = entityAdapter.getSelectors();

const initialState: ProductsState = entityAdapter.getInitialState({
  loading: false,
});

export const productsReducer = createReducer(initialState,
  // Load Product
  on(ProductActions.loadProducts, state => ({ ...state, loading: true })),
  on(ProductActions.loadProductsSuccess, (state, { products }) =>
    entityAdapter.setAll(products, { ...state, loading: false })
  ),
  on(ProductActions.loadProductsFailure, (state) => ({ ...state, loading: false })),

  // Create Product
  on(ProductActions.createProduct, state => ({ ...state, loading: true })),
  on(ProductActions.createProductSuccess, (state, { product }) =>
    entityAdapter.addOne(product, { ...state, loading: false })
  ),
  on(ProductActions.createProductFailure, (state) => ({ ...state, loading: false })),

  // Update Product
  on(ProductActions.updateProduct, state => ({ ...state, loading: true })),
  on(ProductActions.updateProductSuccess, (state, { product }) =>
    entityAdapter.upsertOne(product, { ...state, loading: false })
  ),
  on(ProductActions.updateProductFailure, (state) => ({ ...state, loading: false })),

  // Delete Product
  on(ProductActions.deleteProduct, state => ({ ...state, loading: true } )),
  on(ProductActions.deleteProductSuccess, (state, { productId }) =>
    entityAdapter.removeOne(productId, { ...state, loading: false })
  ),
  on(ProductActions.deleteProductFailure, (state) => ({ ...state, loading: false })),
);
