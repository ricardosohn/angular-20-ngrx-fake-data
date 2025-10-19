import { Component, computed, inject, OnInit, signal, viewChild } from '@angular/core';
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
  readonly search = signal<string>('');

  readonly filteredProducts = computed(() => {
    const searchParams = this.search().toLowerCase().trim();
    const items = this.vm.products();
    if (!searchParams) return items;
    return items.filter(p =>
      p.title.toLowerCase().includes(searchParams) ||
      p.category.toLowerCase().includes(searchParams) ||
      p.description.toLowerCase().includes(searchParams) ||
      p.price.toString().includes(searchParams)
    );
  });

  readonly deleteModalId = 'modal-delete-product';
  readonly confirmDialog = viewChild(ConfirmDialogComponent);
  readonly formModal = viewChild(ProductFormModalComponent);

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.vm.loadAll();
  }

  edit(product: Product): void {
    this.selectedEdit.set(product);
    this.formModal()?.openModal();
  }

  openFormModal(): void {
    this.selectedEdit.set(null);
    this.formModal()?.openModal();
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

  onSearch(value: string): void {
    this.search.set(value ?? '');
  }
}
