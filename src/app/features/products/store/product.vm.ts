import { inject, Injectable } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";
import { selectLoading, selectProducts } from "./product.selectors";
import { ProductActions } from "./product.actions";
import { CreateProductDto, Product, UpdateProductDto } from "../models/product.model";

@Injectable({ providedIn: 'root' })
export class ProductVM {
  private readonly store = inject(Store);

  readonly products = toSignal(this.store.select(selectProducts), { initialValue: [] });
  readonly loading = toSignal(this.store.select(selectLoading), { initialValue: false });

  loadAll(): void {
    this.store.dispatch(ProductActions.loadProducts());
  }

  updateProduct(id: number, productChanges: UpdateProductDto): void {
    this.store.dispatch(ProductActions.updateProduct({ id, productChanges }));
  }

  deleteProduct(productId: number): void {
    this.store.dispatch(ProductActions.deleteProduct({ productId }));
  }

  createProduct(dto: CreateProductDto): void {
    this.store.dispatch(ProductActions.createProduct({ dto }));
  }
}
