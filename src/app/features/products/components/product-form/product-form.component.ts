import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { TranslatePipe } from "../../../../shared/pipes/translate.pipe";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateProductDto } from '../../models/product.model';
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

  readonly form = this.fb.group({
    title: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
    price: this.fb.control<number | null>(null, [Validators.required, Validators.min(0.01)]),
    description: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(10)]),
    category: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
    image: this.fb.control<string | null>(null, [Validators.required])
  });

  readonly selectedFileName = signal<string | null>(null);

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

    this.submitted.emit(dto);
    this.resetForm();
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
