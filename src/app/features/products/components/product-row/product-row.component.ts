import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Product } from '../../models/product.model';
import { TranslatePipe } from "../../../../shared/pipes/translate.pipe";

@Component({
  selector: 'tr[app-product-row]',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './product-row.component.html',
  styleUrl: './product-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductRowComponent {
  readonly product = input.required<Product>();
  readonly edit = output<Product>();
  readonly remove = output<Product>();
}
