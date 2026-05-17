import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserDTO } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private url = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.url}/all`);
  }

  getById(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.url}/${id}`);
  }

  getByUsername(username: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(
      `${this.url}/by-username/${encodeURIComponent(username)}`,
    );
  }

  toggleActive(id: number): Observable<any> {
    return this.http.put(`${this.url}/toggle-active/${id}`, {});
  }
}
