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
    return this.http.post(`${this.url}/create`, this.toSalaryApiDto(dto));
  }

  // Note: update sends full object in body — no id in URL
  update(dto: SalaryDTO): Observable<any> {
    return this.http.put(`${this.url}/update`, this.toSalaryApiDto(dto));
  }

  // revise sends SalaryRevisionDTO in body
  revise(dto: SalaryRevisionDTO): Observable<any> {
    return this.http.post(`${this.url}/revise`, this.toRevisionApiDto(dto));
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/delete/${id}`);
  }

  private toSalaryApiDto(dto: SalaryDTO): Record<string, unknown> {
    return {
      SalaryId: dto.salaryId,
      EmployeeId: dto.employeeId,
      BasicSalary: dto.basicSalary,
      HouseAllowance: dto.houseAllowance,
      MedicalAllowance: dto.medicalAllowance,
      TransportAllowance: dto.transportAllowance,
      GrossSalary: dto.grossSalary,
      IsActive: dto.isActive,
      Remarks: dto.remarks,
      CreatedAt: dto.createdAt,
    };
  }

  private toRevisionApiDto(dto: SalaryRevisionDTO): Record<string, unknown> {
    return {
      RevisionId: dto.revisionId,
      EmployeeId: dto.employeeId,
      OldSalary: dto.oldSalary,
      NewSalary: dto.newSalary,
      Reason: dto.reason,
      RevisedBy: dto.revisedBy,
      CreatedAt: dto.createdAt,
    };
  }
}
