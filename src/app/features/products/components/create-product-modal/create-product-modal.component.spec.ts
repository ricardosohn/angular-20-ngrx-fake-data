import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CreateProductDto, Product, UpdateProductDto } from '../../models/product.model';
import { CreateProductModalComponent } from './create-product-modal.component';
import { ProductVM } from '../../store/product.vm';
import { ProductFormComponent } from '../product-form/product-form.component';
import { TranslationService } from '../../../../core/services/translation.service';
import { provideNgxMask } from 'ngx-mask';

@Pipe({ name: 'translate', standalone: true })
class TranslatePipeStub implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('CreateProductModalComponent', () => {
  let fixture: ComponentFixture<CreateProductModalComponent>;
  let component: CreateProductModalComponent;

  const vmMock: Pick<ProductVM, 'createProduct' | 'updateProduct'> = {
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProductModalComponent],
      providers: [
        { provide: ProductVM, useValue: vmMock },
        { provide: TranslationService, useValue: { translate: (k: string) => k } },
        provideNgxMask(),
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CreateProductModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getModalCheckbox(): HTMLInputElement {
    return fixture.nativeElement.querySelector('#modal-1') as HTMLInputElement;
  }

  function getFormStub(): ProductFormComponent {
    return fixture.debugElement.query(By.directive(ProductFormComponent))
      .componentInstance as ProductFormComponent;
  }

  it('deve exibir título de "novo" por padrão e "editar" quando initial é definido', () => {
    // Arrange: initial null por padrão
    fixture.detectChanges();
    const h2: HTMLElement = fixture.nativeElement.querySelector('h2');
    expect(h2.textContent?.trim()).toBe('newProduct');

    // Act: define initial (edição)
    const product: Product = {
      id: 1,
      title: 'P1',
      price: 10,
      description: 'desc desc desc',
      category: 'cat',
      image: 'img',
    };
    fixture.componentRef.setInput('initial', product);
    fixture.detectChanges();
    // Assert
    expect(h2.textContent?.trim()).toBe('editProduct');
  });

  it('deve abrir e fechar o modal via API open() e submissão', () => {
    // Arrange
    fixture.detectChanges();

    // Act: abre via método
    component.open();
    fixture.detectChanges();
    expect(getModalCheckbox().checked).toBe(true);

    // Act: emite submitted no form e deve fechar
    let closedCount = 0;
    const sub = component.closed.subscribe(() => closedCount++);
    const dto: CreateProductDto = {
      title: 'A',
      price: 12.3,
      description: 'abcdefghij',
      category: 'cat',
      image: 'base64',
    };
    getFormStub().submitted.emit(dto);
    fixture.detectChanges();
    // Assert
    expect(vmMock.createProduct).toHaveBeenCalledWith(dto);
    expect(getModalCheckbox().checked).toBe(false);
    expect(closedCount).toBe(1);
    sub.unsubscribe();
  });

  it('deve chamar updateProduct ao receber updated do formulário e fechar modal', () => {
    // Arrange: abre para validar fechamento depois
    component.open();
    fixture.detectChanges();
    expect(getModalCheckbox().checked).toBe(true);

    let closedCount = 0;
    const sub = component.closed.subscribe(() => closedCount++);
    const payload = { id: 2, changes: { title: 'X' } as UpdateProductDto };
    // Act
    getFormStub().updated.emit(payload);
    fixture.detectChanges();
    // Assert
    expect(vmMock.updateProduct).toHaveBeenCalledWith(payload.id, payload.changes);
    expect(getModalCheckbox().checked).toBe(false);
    expect(closedCount).toBe(1);
    sub.unsubscribe();
  });

  it('deve resetar o formulário ao abrir quando initial é null', () => {
    // Arrange: garante initial null
  fixture.componentRef.setInput('initial', null);
    fixture.detectChanges();
    const formStub = getFormStub() as unknown as ProductFormComponent;
    const spy = jest.spyOn(formStub, 'resetForm');

    // Act: marca como aberto e dispara change
    const checkbox = getModalCheckbox();
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    // Assert
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('não deve resetar o formulário ao abrir quando initial está definido', () => {
    // Arrange
    const product: Product = {
      id: 1,
      title: 'P1',
      price: 10,
      description: 'desc desc desc',
      category: 'cat',
      image: 'img',
    };
  fixture.componentRef.setInput('initial', product);
    fixture.detectChanges();

  const formStub = getFormStub() as unknown as ProductFormComponent;
  const spy = jest.spyOn(formStub, 'resetForm');
    // Act
    const checkbox = getModalCheckbox();
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    // Assert
    expect(spy).not.toHaveBeenCalled();
  });
});
