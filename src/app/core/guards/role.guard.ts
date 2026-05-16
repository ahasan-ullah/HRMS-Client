import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const role = localStorage.getItem('role') ?? '';
  const allowedRoles: string[] = route.data['roles'] ?? [];

  if (allowedRoles.length === 0 || allowedRoles.includes(role)) {
    return true;
  }

  // Logged in but wrong role — redirect to dashboard
  router.navigate(['/dashboard']);
  return false;
};