import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { LayoutComponent } from './shared/components/layout/layout.component';

export const routes: Routes = [
  // Public
  {
    path: 'login',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.authRoutes)
  },

  // Protected — all inside layout
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then(m => m.dashboardRoutes)
      },
      {
        path: 'employees',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'HR'] },
        loadChildren: () =>
          import('./features/employees/employees.routes').then(m => m.employeeRoutes)
      },
      {
        path: 'departments',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'HR'] },
        loadChildren: () =>
          import('./features/departments/departments.routes').then(m => m.departmentRoutes)
      },
      {
        path: 'salary',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'HR'] },
        loadChildren: () =>
          import('./features/salary/salary.routes').then(m => m.salaryRoutes)
      },
      {
        path: 'deductions',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'HR'] },
        loadChildren: () =>
          import('./features/deductions/deductions.routes').then(m => m.deductionRoutes)
      },
      {
        path: 'bonuses',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'HR'] },
        loadChildren: () =>
          import('./features/bonuses/bonuses.routes').then(m => m.bonusRoutes)
      },
      {
        path: 'payroll',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'HR'] },
        loadChildren: () =>
          import('./features/payroll/payroll.routes').then(m => m.payrollRoutes)
      },
      {
        path: 'users',
        canActivate: [roleGuard],
        data: { roles: ['Admin'] },
        loadChildren: () =>
          import('./features/users/users.routes').then(m => m.userRoutes)
      }
    ]
  },

  // Fallback
  { path: '**', redirectTo: 'dashboard' }
];