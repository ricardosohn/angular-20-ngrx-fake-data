import { Component, ElementRef, computed, inject, input, output, viewChild } from '@angular/core';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ProductVM } from '../../store/product.vm';
import { CreateProductDto, Product, UpdateProductDto } from '../../models/product.model';

@Component({
  selector: 'app-product-form-modal',
  imports: [TranslatePipe, ProductFormComponent],
  templateUrl: './product-form-modal.component.html',
})
export class ProductFormModalComponent {
  private readonly vm = inject(ProductVM);
  readonly formComp = viewChild(ProductFormComponent);
  readonly modalInput = viewChild<ElementRef<HTMLInputElement>>('modalInput');
  readonly initial = input<Product | null>(null);
  readonly titleKey = computed(() => (this.initial() ? 'editProduct' : 'newProduct'));
  readonly closed = output<void>();

  onSubmitted(dto: CreateProductDto) {
    this.vm.createProduct(dto);
    this.closeModal();
  }

  onUpdated(payload: { id: number; changes: UpdateProductDto }) {
    this.vm.updateProduct(payload.id, payload.changes);
    this.closeModal();
  }

  onToggle() {
    // Sempre que o modal for aberto, resetar o formulário
    const checked = this.modalInput()?.nativeElement.checked;
    if (checked && !this.initial()) this.formComp()?.resetForm();
  }

  openModal() {
    if (this.modalInput()) this.modalInput()!.nativeElement.checked = true;
  }

  private closeModal() {
    if (this.modalInput()) this.modalInput()!.nativeElement.checked = false;
    this.closed.emit();
  }
}
