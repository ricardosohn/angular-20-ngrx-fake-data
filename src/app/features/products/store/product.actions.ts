import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Product, UpdateProductDto, CreateProductDto } from '../models/product.model';

export const ProductActions = createActionGroup({
  source: 'Products',
  events: {
    loadProducts: emptyProps(),
    loadProductsSuccess: props<{ products: Product[] }>(),
    loadProductsFailure: props<{ error: unknown }>(),

    createProduct: props<{ dto: CreateProductDto }>(),
    createProductSuccess: props<{ product: Product }>(),
    createProductFailure: props<{ error: unknown }>(),

    updateProduct: props<{ id: number, productChanges: UpdateProductDto }>(),
    updateProductSuccess: props<{ product: Product }>(),
    updateProductFailure: props<{ error: unknown }>(),

    deleteProduct: props<{ productId: number }>(),
    deleteProductSuccess: props<{ productId: number }>(),
    deleteProductFailure: props<{ error: unknown }>(),
  },
});
