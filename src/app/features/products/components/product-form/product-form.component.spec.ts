import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductFormComponent } from './product-form.component';
import { TranslationService } from '../../../../core/services/translation.service';
import { provideNgxMask } from 'ngx-mask';
import { CreateProductDto, Product, UpdateProductDto } from '../../models/product.model';

describe('ProductFormComponent', () => {
  let fixture: ComponentFixture<ProductFormComponent>;
  let component: ProductFormComponent;

  beforeEach(async () => {
    // Arrange: TestBed com providers necessários
    await TestBed.configureTestingModule({
      imports: [ProductFormComponent],
      providers: [
        { provide: TranslationService, useValue: { translate: (k: string) => k } },
        provideNgxMask(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve preencher o formulário e remover obrigatoriedade da imagem quando initial é definido', () => {
    // Arrange
    const initial: Product = {
      id: 1,
      title: 'T-1',
      price: 123.45,
      description: 'descricao longa o suficiente',
      category: 'cat-1',
      image: 'img-1',
    };

    // Act
    fixture.componentRef.setInput('initial', initial);
    fixture.detectChanges();

    // Assert: valores preenchidos
    expect(component.form.value).toEqual({
      title: initial.title,
      price: initial.price,
      description: initial.description,
      category: initial.category,
      image: initial.image,
    });

    // Assert: imagem não obrigatória em modo edição
    component.form.controls.image.setValue(null);
    component.form.controls.image.updateValueAndValidity();
    expect(component.form.controls.image.hasError('required')).toBe(false);
  });

  it('deve restaurar obrigatoriedade da imagem quando voltar para modo criação (initial = null)', () => {
    // Arrange: começa em edição
    const initial: Product = {
      id: 1,
      title: 'T-1',
      price: 1,
      description: 'AAAAAAAAAA',
      category: 'cat',
      image: 'img',
    };
    fixture.componentRef.setInput('initial', initial);
    fixture.detectChanges();

    // Act: volta para criação
    fixture.componentRef.setInput('initial', null);
    fixture.detectChanges();

    // Assert: imagem volta a ser obrigatória
    component.form.controls.image.setValue(null);
    component.form.controls.image.updateValueAndValidity();
    expect(component.form.controls.image.hasError('required')).toBe(true);
  });

  it('deve emitir submitted com DTO válido e resetar formulário no modo criação', () => {
    // Arrange: modo criação (initial null)
    fixture.componentRef.setInput('initial', null);
    fixture.detectChanges();
    const submittedSpy = jest.fn();
    const sub = component.submitted.subscribe(submittedSpy);

    component.form.setValue({
      title: 'Produto X',
      price: 99.99,
      description: 'Uma descrição válida com mais de 10 chars',
      category: 'Categoria',
      image: 'data:image/png;base64,xyz',
    });

    // Act
    component.submit();
    fixture.detectChanges();

    // Assert: emissão e reset
    const expected: CreateProductDto = {
      title: 'Produto X',
      price: 99.99,
      description: 'Uma descrição válida com mais de 10 chars',
      category: 'Categoria',
      image: 'data:image/png;base64,xyz',
    };
    expect(submittedSpy).toHaveBeenCalledWith(expected);
    expect(component.form.value).toEqual({
      title: '',
      price: null,
      description: '',
      category: '',
      image: null,
    });

    sub.unsubscribe();
  });

  it('não deve emitir submitted quando formulário for inválido no modo criação e deve marcar como tocado', () => {
    // Arrange
    fixture.componentRef.setInput('initial', null);
    fixture.detectChanges();
    const submittedSpy = jest.fn();
    const sub = component.submitted.subscribe(submittedSpy);

    // Form inválido (faltando vários campos)
    component.form.patchValue({ title: 'A' });

    // Act
    component.submit();
    fixture.detectChanges();

    // Assert
    expect(submittedSpy).not.toHaveBeenCalled();
    // Pelo menos alguns controles devem estar marcados como tocados
    expect(component.form.touched).toBe(true);

    sub.unsubscribe();
  });

  it('deve emitir somente campos alterados em modo edição e não resetar formulário', () => {
    // Arrange: initial com valores base
    const initial: Product = {
      id: 10,
      title: 'Base',
      price: 10,
      description: 'Descricao base 12345',
      category: 'Cat',
      image: 'img-base',
    };
    fixture.componentRef.setInput('initial', initial);
    fixture.detectChanges();
    const updatedSpy = jest.fn();
    const sub = component.updated.subscribe(updatedSpy);
    const resetSpy = jest.spyOn(component, 'resetForm');

    // Altera apenas título e categoria
    component.form.patchValue({
      title: 'Base-2',
      category: 'Cat-2',
    });

    // Act
    component.submit();
    fixture.detectChanges();

    // Assert: somente campos alterados
    const expectedChanges: UpdateProductDto = { title: 'Base-2', category: 'Cat-2' };
    expect(updatedSpy).toHaveBeenCalledWith({ id: initial.id, changes: expectedChanges });
    expect(resetSpy).not.toHaveBeenCalled();

    sub.unsubscribe();
  });

  describe('seleção e limpeza de arquivo', () => {
  let OriginalFileReader: unknown;

    beforeEach(() => {
  OriginalFileReader = (globalThis as unknown as { FileReader: typeof FileReader }).FileReader;
    });

    afterEach(() => {
  (globalThis as unknown as { FileReader: typeof FileReader }).FileReader = OriginalFileReader as typeof FileReader;
    });

    it('deve setar imagem e selectedFileName ao selecionar arquivo', () => {
      // Arrange
      const mockResult = 'data:image/png;base64,AAA';
      class FRMock {
        public onload: ((this: FileReader, ev?: Event) => void) | null = null;
        public result: string | ArrayBuffer | null = null;
        readAsDataURL(_file: File) {
          this.result = mockResult;
          // Simula async
          setTimeout(() => this.onload && this.onload.call(this as unknown as FileReader, new Event('load')), 0);
        }
      }
      (globalThis as unknown as { FileReader: typeof FileReader }).FileReader = FRMock as unknown as typeof FileReader;

      const input = document.createElement('input');
      const file = new File(['x'], 'pic.png', { type: 'image/png' });
      Object.defineProperty(input, 'files', {
        value: [file],
      });

      // Act
      component.onFileSelected({ target: input } as unknown as Event);

      // Assert (async tick)
      return new Promise<void>((resolve) => setTimeout(resolve, 0)).then(() => {
        expect(component.form.controls.image.value).toBe(mockResult);
        expect(component.selectedFileName()).toBe('pic.png');
      });
    });

    it('deve limpar imagem e input quando nenhum arquivo for selecionado', () => {
      // Arrange
      const input = document.createElement('input');
      // Garante valor anterior
      component.form.controls.image.setValue('algo');
      input.value = 'C:fakepath\\x.png';
      Object.defineProperty(input, 'files', { value: null });

      // Act
      component.onFileSelected({ target: input } as unknown as Event);

      // Assert
      expect(component.form.controls.image.value).toBeNull();
      expect(component.selectedFileName()).toBeNull();
      expect(input.value).toBe('');
    });
  });
});
