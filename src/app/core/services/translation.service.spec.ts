import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslationService } from '../services/translation.service';

describe('TranslationService', () => {
  let service: TranslationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Arrange
    localStorage.removeItem('lang');
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), TranslationService],
    });
    service = TestBed.inject(TranslationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve iniciar com idioma padrão pt', () => {
    // Act
    const lang = service.lang();
    // Assert
    expect(lang).toBe('pt');
  });

  it('deve carregar dicionário e traduzir uma chave', async () => {
    // Arrange
    const dict = { hello: 'Hello' };

    // Act
    const loadPromise = service.load('en');
    const req = httpMock.expectOne('/i18n/en.json');
    expect(req.request.method).toBe('GET');
    req.flush(dict);
    await loadPromise;

    // Assert
    expect(service.lang()).toBe('en');
    expect(service.translate('hello')).toBe('Hello');
  });

  it('deve interpolar parâmetros na tradução', async () => {
    // Arrange
    const dict = { greet: 'Olá, {nome}!' };

    // Act
    const loadPromise = service.load('pt');
    const req = httpMock.expectOne('/i18n/pt.json');
    req.flush(dict);
    await loadPromise;

    // Assert
    expect(service.translate('greet', { nome: 'Ricardo' })).toBe('Olá, Ricardo!');
  });

  it('deve fazer fallback para a própria chave quando não encontrada', async () => {
    // Arrange
    const dict = {} as Record<string, string>;

    // Act
    const loadPromise = service.load('en');
    const req = httpMock.expectOne('/i18n/en.json');
    req.flush(dict);
    await loadPromise;

    // Assert
    expect(service.translate('missing.key')).toBe('missing.key');
  });

  it('deve cachear dicionário e evitar nova requisição', async () => {
    // Arrange
    const dict = { a: 'A' };

    // Act 1: Primeiro load
    const p1 = service.load('en');
    const req1 = httpMock.expectOne('/i18n/en.json');
    req1.flush(dict);
    await p1;

    // Act 2: Segundo load do mesmo idioma
    await service.load('en');

    // Assert: não deve haver nova requisição para en.json
    httpMock.expectNone('/i18n/en.json');
    expect(service.translate('a')).toBe('A');
  });
});
