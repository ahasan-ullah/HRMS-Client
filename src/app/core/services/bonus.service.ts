import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BonusDTO } from '../models/bonus.model';

@Injectable({ providedIn: 'root' })
export class BonusService {
  private url = `${environment.apiUrl}/bonus`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<BonusDTO[]> {
    return this.http.get<BonusDTO[]>(`${this.url}/all`);
  }

  getById(id: number): Observable<BonusDTO> {
    return this.http.get<BonusDTO>(`${this.url}/${id}`);
  }

  getByEmployee(employeeId: number): Observable<BonusDTO[]> {
    return this.http.get<BonusDTO[]>(
      `${this.url}/employee/${employeeId}`
    );
  }

  create(dto: BonusDTO): Observable<any> {
    return this.http.post(`${this.url}/create`, dto);
  }

  // Note: update sends full object in body — no id in URL
  update(dto: BonusDTO): Observable<any> {
    return this.http.put(`${this.url}/update`, dto);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/delete/${id}`);
  }
}