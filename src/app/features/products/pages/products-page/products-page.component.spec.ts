import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ProductsPageComponent } from './products-page.component';
import { ProductVM } from '../../store/product.vm';
import { Product } from '../../models/product.model';
import { TranslationService } from '../../../../core/services/translation.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'translate', standalone: true })
class TranslatePipeStub implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}
import { provideNgxMask } from 'ngx-mask';

// Stubs for child components
@Component({ selector: 'app-product-form-modal', template: '', standalone: true })
class StubFormModal {
  @Input() initial: Product | null = null;
  openModal = jest.fn();
}

@Component({ selector: 'app-confirm-dialog', template: '', standalone: true })
class StubConfirmDialog {
  @Input() modalId = '';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  open = jest.fn();
}

@Component({ selector: 'app-loading-overlay', template: '', standalone: true })
class StubLoadingOverlay { @Input() loading = false; }

@Component({ selector: '[app-product-row]', template: '', standalone: true })
class StubProductRow {
  @Input() product!: Product;
  @Output() edit = new EventEmitter<Product>();
  @Output() remove = new EventEmitter<Product>();
}

describe('ProductsPageComponent', () => {
  let fixture: ComponentFixture<ProductsPageComponent>;
  let component: ProductsPageComponent;

  const sampleProducts: Product[] = [
    { id: 1, title: 'A', price: 10, description: 'desc', category: 'cat', image: 'i' },
    { id: 2, title: 'B', price: 20, description: 'desc2', category: 'cat2', image: 'i2' },
  ];

  const vmMock: Partial<ProductVM> = {
    products: jest.fn(() => sampleProducts),
    loading: jest.fn(() => false),
    loadAll: jest.fn(),
    deleteProduct: jest.fn(),
  } as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsPageComponent, StubFormModal, StubConfirmDialog, StubLoadingOverlay, StubProductRow],
      providers: [
        { provide: ProductVM, useValue: vmMock } as any,
        { provide: TranslationService, useValue: { translate: (k: string) => k } },
        provideNgxMask(),
      ],
    })
      .overrideComponent(ProductsPageComponent, {
        set: {
          imports: [TranslatePipeStub, StubProductRow, StubFormModal, StubConfirmDialog, StubLoadingOverlay],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ProductsPageComponent);
    component = fixture.componentInstance;
  });

  it('deve chamar vm.loadAll no ngOnInit', () => {
    // Arrange
    // Act
    fixture.detectChanges(); // triggers ngOnInit
    // Assert
    expect(vmMock.loadAll).toHaveBeenCalled();
  });

  it('deve abrir form modal em novo produto', () => {
    // Arrange
    fixture.detectChanges();
    // Arrange: inject a fake formModal instance that the viewChild would return
    const form = { openModal: jest.fn() } as any;
    (component as any).formModal = () => form;

    // Act
    component.openFormModal();

    // Assert
    expect(form.openModal).toHaveBeenCalled();
    expect(component.selectedEdit()).toBeNull();
  });

  it('deve preparar edição e abrir modal ao editar um produto', () => {
    // Arrange
    fixture.detectChanges();
    const p = sampleProducts[0];
    const form = { openModal: jest.fn() } as any;
    (component as any).formModal = () => form;

    // Act
    component.edit(p);

    // Assert
    expect(component.selectedEdit()).toBe(p);
    expect(form.openModal).toHaveBeenCalled();
  });

  it('deve abrir confirm dialog ao pedir remoção', () => {
    // Arrange
    fixture.detectChanges();
    const p = sampleProducts[1];
    const confirm = { open: jest.fn() } as any;
    (component as any).confirmDialog = () => confirm;

    // Act
    component.askRemove(p);

    // Assert
    expect(component.selectedProduct()).toBe(p);
    expect(confirm.open).toHaveBeenCalled();
  });

  it('deve deletar produto ao confirmar remoção', () => {
    // Arrange
    fixture.detectChanges();
    const p = sampleProducts[1];
    component.selectedProduct.set(p);

    // Act
    component.confirmRemove();

    // Assert
    expect(vmMock.deleteProduct).toHaveBeenCalledWith(p.id);
    expect(component.selectedProduct()).toBeNull();
  });

  it('deve limpar seleção ao cancelar remoção', () => {
    // Arrange
    fixture.detectChanges();
    const p = sampleProducts[0];
    component.selectedProduct.set(p);

    // Act
    component.cancelRemove();

    // Assert
    expect(component.selectedProduct()).toBeNull();
  });

  it('deve filtrar produtos por busca', () => {
    // Arrange
    fixture.detectChanges();

    // Act
    component.onSearch('B');

    // Assert
    const filtered = component.filteredProducts();
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe(2);
  });
});
