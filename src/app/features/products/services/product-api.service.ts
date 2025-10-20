import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, CreateProductDto, UpdateProductDto } from '../models/product.model';
import { ApiClient } from '../../../core/services/api-client.service';

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  private readonly api: ApiClient = inject(ApiClient);

  list(): Observable<Product[]> {
    return this.api.get<Product[]>(`products`);
  }

  get(id: number): Observable<Product> {
    return this.api.get<Product>(`products/${id}`);
  }

  create(dto: CreateProductDto): Observable<Product> {
    return this.api.post<Product>(`products`, dto);
  }

  update(id: number, dto: UpdateProductDto): Observable<Product> {
    return this.api.put<Product>(`products/${id}`, dto);
  }

  delete(id: number): Observable<Product> {
    return this.api.delete<Product>(`products/${id}`);
  }
}
