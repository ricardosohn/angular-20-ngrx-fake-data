import { TestBed } from '@angular/core/testing';
import { UserApiService } from './users.service';
import { ApiClient } from '../../../core/services/api-client.service';

class ApiClientMock {
  get = jest.fn();
  post = jest.fn();
  put = jest.fn();
  delete = jest.fn();
}

describe('UserApiService', () => {
  let service: UserApiService;
  let client: ApiClientMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserApiService,
        { provide: ApiClient, useClass: ApiClientMock }
      ]
    });
    service = TestBed.inject(UserApiService);
    client = TestBed.inject(ApiClient) as unknown as ApiClientMock;
  });

  it('deve chamar ApiClient.get("users") ao listar', () => {
    // Arrange
    client.get.mockReturnValue({ subscribe: () => {} });

    // Act
    service.list();

    // Assert
    expect(client.get).toHaveBeenCalledWith('users');
  });

  it('deve chamar ApiClient.get("users/1") ao buscar por id', () => {
    // Arrange
    client.get.mockReturnValue({ subscribe: () => {} });

    // Act
    service.get(1);

    // Assert
    expect(client.get).toHaveBeenCalledWith('users/1');
  });

  it('deve chamar ApiClient.post("users", dto) ao criar', () => {
    // Arrange
  const dto = { username: 'u' } as Record<string, unknown>;
    client.post.mockReturnValue({ subscribe: () => {} });

    // Act
  service.create(dto as unknown as Parameters<UserApiService['create']>[0]);

    // Assert
    expect(client.post).toHaveBeenCalledWith('users', dto);
  });

  it('deve chamar ApiClient.put("users/1", dto) ao atualizar', () => {
    // Arrange
  const dto = { username: 'x' } as Record<string, unknown>;
    client.put.mockReturnValue({ subscribe: () => {} });

    // Act
  service.update(1, dto as unknown as Parameters<UserApiService['update']>[1]);

    // Assert
    expect(client.put).toHaveBeenCalledWith('users/1', dto);
  });

  it('deve chamar ApiClient.delete("users/1") ao remover', () => {
    // Arrange
    client.delete.mockReturnValue({ subscribe: () => {} });

    // Act
    service.delete(1);

    // Assert
    expect(client.delete).toHaveBeenCalledWith('users/1');
  });
});
