import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DeductionDTO } from '../models/deduction.model';

@Injectable({ providedIn: 'root' })
export class DeductionService {
  private url = `${environment.apiUrl}/deduction`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<DeductionDTO[]> {
    return this.http.get<DeductionDTO[]>(`${this.url}/all`);
  }

  getById(id: number): Observable<DeductionDTO> {
    return this.http.get<DeductionDTO>(`${this.url}/${id}`);
  }

  getByEmployee(employeeId: number): Observable<DeductionDTO[]> {
    return this.http.get<DeductionDTO[]>(
      `${this.url}/employee/${employeeId}`
    );
  }

  getByEmployeeAndPeriod(
    employeeId: number,
    month: number,
    year: number
  ): Observable<DeductionDTO[]> {
    return this.http.get<DeductionDTO[]>(
      `${this.url}/employee/${employeeId}/${month}/${year}`
    );
  }

  create(dto: DeductionDTO): Observable<any> {
    return this.http.post(`${this.url}/create`, dto);
  }

  // Note: update sends full object in body — no id in URL
  update(dto: DeductionDTO): Observable<any> {
    return this.http.put(`${this.url}/update`, dto);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/delete/${id}`);
  }
}