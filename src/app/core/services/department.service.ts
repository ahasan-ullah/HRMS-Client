import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DepartmentDTO } from '../models/department.model';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private url = `${environment.apiUrl}/department`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<DepartmentDTO[]> {
    return this.http.get<DepartmentDTO[]>(`${this.url}/all`);
  }

  getById(id: number): Observable<DepartmentDTO> {
    return this.http.get<DepartmentDTO>(`${this.url}/${id}`);
  }

  create(dto: DepartmentDTO): Observable<any> {
    return this.http.post(`${this.url}/create`, this.toApiDto(dto));
  }

  // Note: update sends full object in body — no id in URL
  update(dto: DepartmentDTO): Observable<any> {
    return this.http.put(`${this.url}/update`, this.toApiDto(dto));
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/delete/${id}`);
  }

  private toApiDto(dto: DepartmentDTO): Record<string, unknown> {
    return {
      DepartmentId: dto.departmentId,
      Name: dto.name,
      Description: dto.description,
      CreatedAt: dto.createdAt,
      EmployeeCount: dto.employeeCount,
    };
  }
}
