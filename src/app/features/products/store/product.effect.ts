import { inject } from "@angular/core";
import { ProductApiService } from "../services/product-api.service";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from "rxjs";
import { ProductActions } from "./product.actions";
import { ToastService } from "../../../shared/services/toast.service";
import { TranslationService } from "../../../core/services/translation.service";

export class ProductEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(ProductApiService);
  private readonly toast = inject(ToastService);
  private readonly i18n = inject(TranslationService);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      switchMap(() =>
        this.api.list().pipe(
          map(products => ProductActions.loadProductsSuccess({ products })),
          catchError(error => of(ProductActions.loadProductsFailure({ error })))
        )
      )
    )
  );

  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.deleteProduct),
      switchMap(({ productId }) =>
        this.api.delete(productId).pipe(
          map(() => ProductActions.deleteProductSuccess({ productId })),
          catchError(error => of(ProductActions.deleteProductFailure({ error })))
        )
      )
    )
  );

  createProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.createProduct),
      switchMap(({ dto }) =>
        this.api.create(dto).pipe(
          map((product) => ProductActions.createProductSuccess({ product })),
          catchError(error => of(ProductActions.createProductFailure({ error })))
        )
      )
    )
  );

  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.updateProduct),
      switchMap(({ id, productChanges }) =>
        this.api.update(id, productChanges).pipe(
          map((product) => ProductActions.updateProductSuccess({ product })),
          catchError(error => of(ProductActions.updateProductFailure({ error })))
        )
      )
    )
  );

  toastOnCreateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.createProductSuccess),
      tap(() => this.toast.success(this.i18n.translate('toastProductCreated')))
    ), { dispatch: false }
  );

  toastOnUpdateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.updateProductSuccess),
      tap(() => this.toast.success(this.i18n.translate('toastProductUpdated')))
    ), { dispatch: false }
  );

  toastOnDeleteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.deleteProductSuccess),
      tap(() => this.toast.success(this.i18n.translate('toastProductDeleted')))
    ), { dispatch: false }
  );
}
