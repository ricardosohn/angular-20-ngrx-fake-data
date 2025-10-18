import { inject, Injectable } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";
import { selectError, selectLoading, selectProducts } from "./product.selectors";
import { ProductActions } from "./product.actions";

@Injectable({ providedIn: 'root' })
export class ProductVM {
  private readonly store = inject(Store);

  readonly products = toSignal(this.store.select(selectProducts), { initialValue: [] });
  readonly loading = toSignal(this.store.select(selectLoading), { initialValue: false });
  readonly error = toSignal(this.store.select(selectError), { initialValue: null });

  loadAll(): void {
    this.store.dispatch(ProductActions.loadProducts());
  }
}
