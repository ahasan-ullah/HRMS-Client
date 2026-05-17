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
    return this.http.post<TokenResponseDTO>(`${this.url}/login`, {
      Username: dto.username,
      Password: dto.password,
    }).pipe(
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
    return this.http.post<TokenResponseDTO>(`${this.url}/refresh`, {
      RefreshToken: dto.refreshToken,
    }).pipe(
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
    return this.http.put(`${this.url}/change-password`, {
      UserId: dto.userId,
      CurrentPassword: dto.currentPassword,
      NewPassword: dto.newPassword,
    });
  }

  assignRole(dto: AssignRoleDTO): Observable<any> {
    return this.http.put(`${this.url}/assign-role`, {
      UserId: dto.userId,
      Role: dto.role,
    });
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
    const storedUserId = parseInt(localStorage.getItem('userId') ?? '0', 10);
    if (storedUserId > 0) return storedUserId;

    const token = localStorage.getItem('accessToken');
    if (!token) return 0;

    try {
      const payload = JSON.parse(atob(token.split('.')[1] ?? ''));
      return Number(payload.userId ?? payload.UserId ?? payload.nameid ?? 0);
    } catch {
      return 0;
    }
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
