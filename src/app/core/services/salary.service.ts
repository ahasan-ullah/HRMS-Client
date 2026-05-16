import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SalaryDTO, SalaryRevisionDTO } from '../models/salary.model';

@Injectable({ providedIn: 'root' })
export class SalaryService {
  private url = `${environment.apiUrl}/salary`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<SalaryDTO[]> {
    return this.http.get<SalaryDTO[]>(`${this.url}/all`);
  }

  getById(id: number): Observable<SalaryDTO> {
    return this.http.get<SalaryDTO>(`${this.url}/${id}`);
  }

  getActiveByEmployee(employeeId: number): Observable<SalaryDTO> {
    return this.http.get<SalaryDTO>(`${this.url}/employee/${employeeId}`);
  }

  getRevisionHistory(employeeId: number): Observable<SalaryRevisionDTO[]> {
    return this.http.get<SalaryRevisionDTO[]>(
      `${this.url}/revisions/${employeeId}`
    );
  }

  create(dto: SalaryDTO): Observable<any> {
    return this.http.post(`${this.url}/create`, dto);
  }

  // Note: update sends full object in body — no id in URL
  update(dto: SalaryDTO): Observable<any> {
    return this.http.put(`${this.url}/update`, dto);
  }

  // revise sends SalaryRevisionDTO in body
  revise(dto: SalaryRevisionDTO): Observable<any> {
    return this.http.post(`${this.url}/revise`, dto);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/delete/${id}`);
  }
}