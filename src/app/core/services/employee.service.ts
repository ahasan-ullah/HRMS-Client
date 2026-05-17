import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EmployeeDTO } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private url = `${environment.apiUrl}/employee`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<EmployeeDTO[]> {
    return this.http.get<EmployeeDTO[]>(`${this.url}/all`);
  }

  getById(id: number): Observable<EmployeeDTO> {
    return this.http.get<EmployeeDTO>(`${this.url}/${id}`);
  }

  search(keyword: string): Observable<EmployeeDTO[]> {
    return this.http.get<EmployeeDTO[]>(`${this.url}/search`, {
      params: new HttpParams().set('keyword', keyword)
    });
  }

  filterByDepartment(departmentId: number): Observable<EmployeeDTO[]> {
    return this.http.get<EmployeeDTO[]>(
      `${this.url}/filter/department/${departmentId}`
    );
  }

  // Note: no filter by status endpoint in your controller
  // search covers status filtering in BLL

  create(dto: EmployeeDTO): Observable<any> {
    return this.http.post(`${this.url}/create`, this.toApiDto(dto));
  }

  // Note: update sends full object in body — no id in URL
  update(dto: EmployeeDTO): Observable<any> {
    return this.http.put(`${this.url}/update`, this.toApiDto(dto));
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/delete/${id}`);
  }

  private toApiDto(dto: EmployeeDTO): Record<string, unknown> {
    return {
      EmployeeId: dto.employeeId,
      DepartmentId: dto.departmentId,
      FirstName: dto.firstName,
      LastName: dto.lastName,
      Email: dto.email,
      Phone: dto.phone,
      Address: dto.address,
      Position: dto.position,
      AccountNumber: dto.accountNumber,
      EmploymentStatus: dto.employmentStatus,
      JoiningDate: dto.joiningDate,
      IsActive: dto.isActive,
      CreatedAt: dto.createdAt,
      UpdatedAt: dto.updatedAt,
    };
  }
}
