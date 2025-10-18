import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { TranslatePipe } from "../../../../shared/pipes/translate.pipe";
import { ProductFormComponent } from "../product-form/product-form.component";
import { ProductVM } from '../../store/product.vm';
import { CreateProductDto } from '../../models/product.model';

@Component({
  selector: 'app-create-product-modal',
  imports: [TranslatePipe, ProductFormComponent],
  templateUrl: './create-product-modal.component.html',
  styleUrl: './create-product-modal.component.scss',
})
export class CreateProductModalComponent {
  private readonly vm = inject(ProductVM);
  readonly formComp = viewChild(ProductFormComponent);
  readonly modalInput = viewChild<ElementRef<HTMLInputElement>>('modalInput');

  onSubmitted(dto: CreateProductDto) {
    this.vm.createProduct(dto);
    this.closeModal();
  }

  onToggle() {
    // Sempre que o modal for aberto, resetar o formulário
    const checked = this.modalInput()?.nativeElement.checked;
    if (checked) this.formComp()?.resetForm();
  }

  private closeModal() {
    if (this.modalInput()) this.modalInput()!.nativeElement.checked = false;
  }
}
