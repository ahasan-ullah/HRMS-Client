import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LoginDTO,
  TokenResponseDTO,
  RefreshTokenDTO,
  ChangePasswordDTO,
  AssignRoleDTO
} from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  login(dto: LoginDTO): Observable<TokenResponseDTO> {
    return this.http.post<TokenResponseDTO>(`${this.url}/login`, dto).pipe(
      tap(res => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        localStorage.setItem('role', res.role);
        localStorage.setItem('userId', res.userId.toString());
        localStorage.setItem('username', res.username);
      })
    );
  }

  refresh(dto: RefreshTokenDTO): Observable<TokenResponseDTO> {
    return this.http.post<TokenResponseDTO>(`${this.url}/refresh`, dto).pipe(
      tap(res => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.url}/logout`, {}).pipe(
      tap(() => this.clearSession())
    );
  }

  changePassword(dto: ChangePasswordDTO): Observable<any> {
    return this.http.put(`${this.url}/change-password`, dto);
  }

  assignRole(dto: AssignRoleDTO): Observable<any> {
    return this.http.put(`${this.url}/assign-role`, dto);
  }

  // ── Local helpers ─────────────────────────────────────
  clearSession(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getRole(): string {
    return localStorage.getItem('role') ?? '';
  }

  getUserId(): number {
    return parseInt(localStorage.getItem('userId') ?? '0');
  }

  getUsername(): string {
    return localStorage.getItem('username') ?? '';
  }

  isAdmin(): boolean {
    return this.getRole() === 'Admin';
  }

  isHR(): boolean {
    return this.getRole() === 'HR';
  }

  isAdminOrHR(): boolean {
    return this.isAdmin() || this.isHR();
  }
}