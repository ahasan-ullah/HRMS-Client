import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Skip adding token for login and refresh endpoints
  const isPublic = req.url.includes('/auth/login') ||
                   req.url.includes('/auth/refresh');

  if (isPublic) return next(req);

  const token = localStorage.getItem('accessToken');

  // Attach token to request
  const authReq = token
    ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      // If 401 — try refresh token once
      if (error.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
          return authService.refresh({ refreshToken }).pipe(
            switchMap(res => {
              // Retry original request with new token
              const retried = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${res.accessToken}`)
              });
              return next(retried);
            }),
            catchError(refreshError => {
              // Refresh failed — force logout
              authService.clearSession();
              return throwError(() => refreshError);
            })
          );
        }

        // No refresh token — force logout
        authService.clearSession();
      }

      return throwError(() => error);
    })
  );
};