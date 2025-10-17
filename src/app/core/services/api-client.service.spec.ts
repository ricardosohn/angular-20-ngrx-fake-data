import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiClient } from './api-client.service';
import { environment } from '../../../environments/environment';

describe('ApiClient', () => {
  let client: ApiClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    client = TestBed.inject(ApiClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('deve realizar GET com baseURL', () => {
    // Arrange
    const expected = { ok: true };

    // Act
    client.get<typeof expected>('test').subscribe((res) => {
      // Assert
      expect(res).toEqual(expected);
    });

    // Assert (request)
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/test`);
    expect(req.request.method).toBe('GET');
    req.flush(expected);
  });

  it('deve realizar POST com body', () => {
    // Arrange
    const body = { a: 1 };

    // Act
    client.post<{ id: number }>('items', body).subscribe((res) => {
      // Assert
      expect(res.id).toBe(123);
    });

    // Assert (request)
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/items`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush({ id: 123 });
  });

  it('deve realizar PUT com body', () => {
    // Arrange
    const body = { a: 2 };
    // Act
    client.put<{ success: boolean }>('items/1', body).subscribe((res) => {
      // Assert
      expect(res.success).toBe(true);
    });

    // Assert (request)
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/items/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);
    req.flush({ success: true });
  });

  it('deve realizar DELETE', () => {
    // Act
    client.delete<{ deleted: boolean }>('items/1').subscribe((res) => {
      // Assert
      expect(res.deleted).toBe(true);
    });
    // Assert (request)
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/items/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ deleted: true });
  });
});
