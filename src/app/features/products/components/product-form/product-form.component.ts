import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { TranslatePipe } from "../../../../shared/pipes/translate.pipe";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateProductDto, Product, UpdateProductDto } from '../../models/product.model';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-product-form',
  imports: [TranslatePipe, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormComponent {
  private readonly fb = inject(FormBuilder);
  readonly submitted = output<CreateProductDto>();
  readonly updated = output<{ id: number; changes: UpdateProductDto }>();
  readonly initial = input<Product | null>(null);

  readonly form = this.fb.group({
    title: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
    price: this.fb.control<number | null>(null, [Validators.required, Validators.min(0.01)]),
    description: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(10)]),
    category: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
    image: this.fb.control<string | null>(null, [Validators.required])
  });

  readonly selectedFileName = signal<string | null>(null);

  // Reage à mudança do produto inicial (modo edição)
  private readonly onInitialChange = effect(() => {
    const initialValue = this.initial();
    if (initialValue) {
      // Preenche o formulário com os dados do produto
      this.form.setValue({
        title: initialValue.title ?? '',
        price: initialValue.price ?? null,
        description: initialValue.description ?? '',
        category: initialValue.category ?? '',
        image: initialValue.image ?? null,
      });
      // Em edição, a imagem não é obrigatória
      this.form.controls.image.clearValidators();
      this.form.controls.image.updateValueAndValidity({ emitEvent: false });
      this.selectedFileName.set(null);
    } else {
      // Voltou para modo criação: restaura validações
      this.form.controls.image.addValidators([Validators.required]);
      this.form.controls.image.updateValueAndValidity({ emitEvent: false });
    }
  });

  clearImage(fileInput?: HTMLInputElement) {
    this.form.controls.image.setValue(null);
    this.form.controls.image.markAsDirty();
    this.selectedFileName.set(null);
    if (fileInput) fileInput.value = '';
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) {
      this.clearImage(input);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      this.form.controls.image.setValue(result);
      this.form.controls.image.markAsDirty();
      this.selectedFileName.set(file.name);
    };
    reader.readAsDataURL(file);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    const dto: CreateProductDto = {
      title: formValue.title,
      price: Number(formValue.price),
      description: formValue.description,
      category: formValue.category,
      image: formValue.image as string,
    };

    const initial = this.initial();
    if (initial) {
      // Emite somente alterações
      const changes: UpdateProductDto = {};
      if (dto.title !== initial.title) changes.title = dto.title;
      if (dto.price !== initial.price) changes.price = dto.price;
      if (dto.description !== initial.description) changes.description = dto.description;
      if (dto.category !== initial.category) changes.category = dto.category;
      if (dto.image && dto.image !== initial.image) changes.image = dto.image;
      this.updated.emit({ id: initial.id, changes });
    } else {
      this.submitted.emit(dto);
      this.resetForm();
    }
  }

  // Utilizado para limpar completamente o form quando abrir / fechar a modal
  resetForm() {
    this.form.reset({
      title: '',
      price: null,
      description: '',
      category: '',
      image: null,
    });
    this.selectedFileName.set(null);
  }
}
