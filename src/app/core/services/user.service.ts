import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDTO, CreateUserDTO, UpdateUserDTO } from '../models/user-dto';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  private readonly usersUrl = 'users';

  constructor(http: HttpClient) {
    super(http);
  }

  getUsers(): Observable<UserDTO[]> {
    return this.get<UserDTO[]>(this.usersUrl);
  }

  getUser(id: string): Observable<UserDTO> {
    return this.get<UserDTO>(`${this.usersUrl}/${id}`);
  }

  createUser(user: CreateUserDTO): Observable<UserDTO> {
    return this.post<UserDTO>(this.usersUrl, user);
  }

  updateUser(id: string, user: UpdateUserDTO): Observable<UserDTO> {
    return this.put<UserDTO>(`${this.usersUrl}/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.delete<void>(`${this.usersUrl}/${id}`);
  }
}
