import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  PayrollDTO,
  PayrollDetailDTO,
  GeneratePayrollDTO
} from '../models/payroll.model';

@Injectable({ providedIn: 'root' })
export class PayrollService {
  private url = `${environment.apiUrl}/payroll`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<PayrollDTO[]> {
    return this.http.get<PayrollDTO[]>(`${this.url}/all`);
  }

  getById(id: number): Observable<PayrollDTO> {
    return this.http.get<PayrollDTO>(`${this.url}/${id}`);
  }

  getDetails(payrollId: number): Observable<PayrollDetailDTO[]> {
    return this.http.get<PayrollDetailDTO[]>(
      `${this.url}/${payrollId}/details`
    );
  }

  // Note: generate sends body GeneratePayrollDTO (not query params)
  generate(dto: GeneratePayrollDTO): Observable<any> {
    return this.http.post(`${this.url}/generate`, dto);
  }

  approve(id: number): Observable<any> {
    return this.http.put(`${this.url}/approve/${id}`, {});
  }

  markAsPaid(id: number): Observable<any> {
    return this.http.put(`${this.url}/markpaid/${id}`, {});
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/delete/${id}`);
  }
}