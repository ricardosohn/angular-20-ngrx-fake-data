import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductRowComponent } from './product-row.component';
import { Product } from '../../models/product.model';
import { TranslationService } from '../../../../core/services/translation.service';

describe('ProductRowComponent', () => {
  let fixture: ComponentFixture<ProductRowComponent>;
  let component: ProductRowComponent;

  const product: Product = {
    id: 1,
    title: 'Awesome Shirt',
    price: 49.9,
    description: 'A very nice shirt for all occasions',
    category: 'men clothing',
    image: 'data:image/png;base64,xxx',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductRowComponent],
      providers: [
        { provide: TranslationService, useValue: { translate: (k: string) => k } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductRowComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', product);
    fixture.detectChanges();
  });

  it('deve renderizar dados básicos do produto (imagem, título, categoria, preço)', () => {
    // Arrange
    const rowEl: HTMLElement = fixture.nativeElement as HTMLElement;

    // Act
    const img = rowEl.querySelector('img') as HTMLImageElement;
    const title = rowEl.querySelector('td:nth-child(2) span:first-child') as HTMLElement;
    const category = rowEl.querySelector('.badge') as HTMLElement;
    const price = rowEl.querySelector('td:nth-child(3)') as HTMLElement;

    // Assert
    expect(img.src).toContain('data:image/png;base64,xxx');
    expect(title.textContent?.trim()).toBe('Awesome Shirt');
    expect(category.textContent?.trim()).toBe('Men Clothing'); // titlecase pipe
    expect(price.textContent?.trim()).toBe('$49.9');
  });

  it('deve emitir o produto ao clicar em editar', () => {
    // Arrange
    const rowEl: HTMLElement = fixture.nativeElement as HTMLElement;
    const editBtn = rowEl.querySelector('button.btn-outline-warning') as HTMLButtonElement;
    const spy = jest.fn();
    const sub = component.edit.subscribe(spy);

    // Act
    editBtn.click();

    // Assert
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(product);
    sub.unsubscribe();
  });

  it('deve emitir o produto ao clicar em remover', () => {
    // Arrange
    const rowEl: HTMLElement = fixture.nativeElement as HTMLElement;
    const removeBtn = rowEl.querySelector('button.btn-outline-error') as HTMLButtonElement;
    const spy = jest.fn();
    const sub = component.remove.subscribe(spy);

    // Act
    removeBtn.click();

    // Assert
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(product);
    sub.unsubscribe();
  });
});
