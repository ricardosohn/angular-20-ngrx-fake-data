import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ProductFormModalComponent } from './product-form-modal.component';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ProductVM } from '../../store/product.vm';
import { provideNgxMask } from 'ngx-mask';
import { TranslationService } from '../../../../core/services/translation.service';
import { CreateProductDto, Product, UpdateProductDto } from '../../models/product.model';

describe('ProductFormModalComponent', () => {
  let fixture: ComponentFixture<ProductFormModalComponent>;
  let component: ProductFormModalComponent;

  const vmMock: Pick<ProductVM, 'createProduct' | 'updateProduct'> = {
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
  } as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormModalComponent],
      providers: [
        { provide: ProductVM, useValue: vmMock },
        { provide: TranslationService, useValue: { translate: (k: string) => k } },
        provideNgxMask(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getCheckbox(): HTMLInputElement {
    return fixture.nativeElement.querySelector('#modal-1') as HTMLInputElement;
  }

  function getForm(): ProductFormComponent {
    return fixture.debugElement.query(By.directive(ProductFormComponent)).componentInstance as ProductFormComponent;
  }

  it('mostra título novo por padrão e editar quando initial set', () => {
    // Arrange
    fixture.detectChanges();
    const h2: HTMLElement = fixture.nativeElement.querySelector('h2');
    // Assert default
    expect(h2.textContent?.trim()).toBe('newProduct');

    // Act: set initial
    const product: Product = { id: 10, title: 'X', price: 1, description: 'desc desc', category: 'c', image: 'i' };
    fixture.componentRef.setInput('initial', product);
    fixture.detectChanges();
    // Assert
    expect(h2.textContent?.trim()).toBe('editProduct');
  });

  it('openModal abre e onSubmitted fecha e chama createProduct', () => {
    // Arrange
    fixture.detectChanges();

    // Act: open
    component.openModal();
    fixture.detectChanges();
    expect(getCheckbox().checked).toBe(true);

    // Act: submit form
    let closed = 0;
    const sub = component.closed.subscribe(() => closed++);
    const dto: CreateProductDto = { title: 'A', price: 1.2, description: '1234567890', category: 'c', image: 'img' };
    getForm().submitted.emit(dto);
    fixture.detectChanges();

    // Assert
    expect(vmMock.createProduct).toHaveBeenCalledWith(dto);
    expect(getCheckbox().checked).toBe(false);
    expect(closed).toBe(1);
    sub.unsubscribe();
  });

  it('onUpdated chama updateProduct e fecha modal', () => {
    // Arrange: open
    component.openModal();
    fixture.detectChanges();
    expect(getCheckbox().checked).toBe(true);

    // Act
    let closed = 0;
    const sub = component.closed.subscribe(() => closed++);
    const payload = { id: 5, changes: { title: 'Z' } as UpdateProductDto };
    getForm().updated.emit(payload);
    fixture.detectChanges();

    // Assert
    expect(vmMock.updateProduct).toHaveBeenCalledWith(payload.id, payload.changes);
    expect(getCheckbox().checked).toBe(false);
    expect(closed).toBe(1);
    sub.unsubscribe();
  });

  it('onToggle reseta o form ao abrir quando initial é null', () => {
    // Arrange: ensure initial null
    fixture.componentRef.setInput('initial', null);
    fixture.detectChanges();
    const form = getForm();
    const spy = jest.spyOn(form, 'resetForm');

    // Act: simulate open via checkbox change
    const checkbox = getCheckbox();
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    // Assert
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('onToggle não reseta quando initial presente', () => {
    // Arrange: set initial
    const product: Product = { id: 2, title: 'P', price: 2, description: 'descdescdesc', category: 'c', image: 'i' };
    fixture.componentRef.setInput('initial', product);
    fixture.detectChanges();
    const form = getForm();
    const spy = jest.spyOn(form, 'resetForm');

    // Act
    const checkbox = getCheckbox();
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    // Assert
    expect(spy).not.toHaveBeenCalled();
  });
});
