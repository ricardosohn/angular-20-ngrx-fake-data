import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { ProductVM } from '../../store/product.vm';
import { TranslatePipe } from "../../../../shared/pipes/translate.pipe";
import { ProductRowComponent } from "../../components/product-row/product-row.component";
import { ProductFormModalComponent } from "../../components/product-form-modal/product-form-modal.component";
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Product } from '../../models/product.model';


@Component({
  selector: 'app-root',
  imports: [TranslatePipe, ProductRowComponent, ProductFormModalComponent, ConfirmDialogComponent],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss'
})
export class ProductsPageComponent implements OnInit{
  readonly vm = inject(ProductVM);

  readonly selectedProduct = signal<Product | null>(null);
  readonly selectedEdit = signal<Product | null>(null);

  readonly deleteModalId = 'modal-delete-product';
  readonly confirmDialog = viewChild(ConfirmDialogComponent);
  readonly createModal = viewChild(ProductFormModalComponent);

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.vm.loadAll();
  }

  edit(product: Product): void {
    this.selectedEdit.set(product);
    this.createModal()?.openModal();
  }

  askRemove(product: Product): void {
    this.selectedProduct.set(product);
    this.confirmDialog()?.open();
  }

  confirmRemove(): void {
    const p = this.selectedProduct();
    if (p) this.vm.deleteProduct(p.id);
    this.selectedProduct.set(null);
  }

  cancelRemove(): void {
    this.selectedProduct.set(null);
  }

  onEditModalClosed(): void {
    this.selectedEdit.set(null);
  }
}
