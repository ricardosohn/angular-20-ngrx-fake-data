import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, CreateUserDto, UpdateUserDto } from '../models/user.model';
import { ApiClient } from '../../../core/services/api-client.service';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private readonly api: ApiClient = inject(ApiClient);

  list(): Observable<User[]> {
    return this.api.get<User[]>(`users`);
  }

  get(id: number): Observable<User> {
    return this.api.get<User>(`users/${id}`);
  }

  create(dto: CreateUserDto): Observable<User> {
    return this.api.post<User>(`users`, dto);
  }

  update(id: number, dto: UpdateUserDto): Observable<User> {
    return this.api.put<User>(`users/${id}`, dto);
  }

  delete(id: number): Observable<User> {
    return this.api.delete<User>(`users/${id}`);
  }
}
