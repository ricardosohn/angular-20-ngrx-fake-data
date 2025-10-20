import { TestBed } from '@angular/core/testing';
import { ProductApiService } from './product-api.service';
import { ApiClient } from '../../../core/services/api-client.service';

class ApiClientMock {
  get = jest.fn();
  post = jest.fn();
  put = jest.fn();
  delete = jest.fn();
}

describe('ProductApiService', () => {
  let service: ProductApiService;
  let client: ApiClientMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductApiService,
        { provide: ApiClient, useClass: ApiClientMock }
      ]
    });
    service = TestBed.inject(ProductApiService);
    client = TestBed.inject(ApiClient) as unknown as ApiClientMock;
  });

  it('deve chamar ApiClient.get("products") ao listar', () => {
    // Arrange
    client.get.mockReturnValue({ subscribe: () => {} });

    // Act
    service.list();

    // Assert
    expect(client.get).toHaveBeenCalledWith('products');
  });

  it('deve chamar ApiClient.get("products/1") ao buscar por id', () => {
    // Arrange
    client.get.mockReturnValue({ subscribe: () => {} });

    // Act
    service.get(1);

    // Assert
    expect(client.get).toHaveBeenCalledWith('products/1');
  });

  it('deve chamar ApiClient.post("products", dto) ao criar', () => {
    // Arrange
    const dto = { title: 't', price: 1, description: '', category: '', image: '' };
    client.post.mockReturnValue({ subscribe: () => {} });

    // Act
    service.create(dto as any);

    // Assert
    expect(client.post).toHaveBeenCalledWith('products', dto);
  });

  it('deve chamar ApiClient.put("products/1", dto) ao atualizar', () => {
    // Arrange
    const dto = { title: 'x' };
    client.put.mockReturnValue({ subscribe: () => {} });

    // Act
    service.update(1, dto as any);

    // Assert
    expect(client.put).toHaveBeenCalledWith('products/1', dto);
  });

  it('deve chamar ApiClient.delete("products/1") ao remover', () => {
    // Arrange
    client.delete.mockReturnValue({ subscribe: () => {} });

    // Act
    service.delete(1);

    // Assert
    expect(client.delete).toHaveBeenCalledWith('products/1');
  });
});
