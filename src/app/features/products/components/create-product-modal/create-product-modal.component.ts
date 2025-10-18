import { Component } from '@angular/core';
import { TranslatePipe } from "../../../../shared/pipes/translate.pipe";
import { ProductFormComponent } from "../product-form/product-form.component";

@Component({
  selector: 'app-create-product-modal',
  imports: [TranslatePipe, ProductFormComponent],
  templateUrl: './create-product-modal.component.html',
  styleUrl: './create-product-modal.component.scss',
})
export class CreateProductModalComponent { }
