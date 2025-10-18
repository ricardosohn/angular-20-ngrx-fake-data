import { Component, inject, OnInit } from '@angular/core';
import { ProductVM } from '../../store/product.vm';
import { TranslatePipe } from "../../../../shared/i18n/translate.pipe";


@Component({
  selector: 'app-root',
  imports: [TranslatePipe],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss'
})
export class ProductsPageComponent implements OnInit{
  readonly vm = inject(ProductVM);

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.vm.loadAll();
  }
}
