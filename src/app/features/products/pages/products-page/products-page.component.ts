import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductVM } from '../../store/product.vm';

@Component({
  selector: 'app-root',
  imports: [],
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
