import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { httpErrorInterceptor } from './http-error.interceptor';
import { ToastService } from '../../shared/services/toast.service';
import { TranslationService } from '../services/translation.service';

describe('httpErrorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  const toast: Partial<ToastService> = { error: jest.fn() };
  const i18n: Partial<TranslationService> = { translate: jest.fn((k: string) => `[${k}]`) };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting(),
        { provide: ToastService, useValue: toast },
        { provide: TranslationService, useValue: i18n },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    jest.clearAllMocks();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('mostra toast traduzido para 404 e propaga erro', (done) => {
    // Arrange
    (i18n.translate as jest.Mock).mockReturnValue('Resource not found');

    // Act
    http.get('/x').subscribe({
      next: () => done.fail('era esperado erro'),
      error: (err: HttpErrorResponse) => {
        // Assert
        expect(i18n.translate).toHaveBeenCalledWith('error404');
        expect(toast.error).toHaveBeenCalledWith('Resource not found');
        expect(err.status).toBe(404);
        done();
      },
    });

    const req = httpMock.expectOne('/x');
    req.flush('fail', { status: 404, statusText: 'Not Found' });
  });

  it('mapeia status 0 para networkError', (done) => {
    // Arrange

    // Act
    http.get('/x').subscribe({
      next: () => done.fail('era esperado erro'),
      error: () => {
        // Assert
        expect(i18n.translate).toHaveBeenCalledWith('networkError');
        expect(toast.error).toHaveBeenCalledTimes(1);
        done();
      },
    });

    const req = httpMock.expectOne('/x');
    req.flush('offline', { status: 0, statusText: 'Unknown Error' });
  });

  it('status não mapeado usa genericError', (done) => {
    // Arrange

    // Act
    http.get('/x').subscribe({
      next: () => done.fail('era esperado erro'),
      error: () => {
        // Assert
        expect(i18n.translate).toHaveBeenCalledWith('genericError');
        expect(toast.error).toHaveBeenCalledTimes(1);
        done();
      },
    });

    const req = httpMock.expectOne('/x');
    req.flush('oops', { status: 418, statusText: "I'm a teapot" });
  });

  it('não mostra toast em sucesso', (done) => {
    // Arrange

    // Act
    http.get('/x').subscribe({
      next: () => {
        // Assert
        expect(i18n.translate).not.toHaveBeenCalled();
        expect(toast.error).not.toHaveBeenCalled();
        done();
      },
      error: done.fail,
    });

    const req = httpMock.expectOne('/x');
    req.flush({ ok: true }, { status: 200, statusText: 'OK' });
  });
});
