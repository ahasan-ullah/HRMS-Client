import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  EmployeeDashboardDTO,
  ManagementDashboardDTO
} from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private url = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getAdmin(): Observable<ManagementDashboardDTO> {
    return this.http.get<ManagementDashboardDTO>(`${this.url}/admin`);
  }

  getHR(): Observable<ManagementDashboardDTO> {
    return this.http.get<ManagementDashboardDTO>(`${this.url}/hr`);
  }

  getEmployee(): Observable<EmployeeDashboardDTO> {
    return this.http.get<EmployeeDashboardDTO>(`${this.url}/employee`);
  }
}
