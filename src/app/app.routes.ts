import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { LayoutComponent } from './shared/components/layout/layout.component';

export const routes: Routes = [
  // Public
  {
    path: 'login',
    loadChildren: () =>
      import('./features/auth/auth.module').then(m => m.authRoutes)
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
          import('./features/dashboard/dashboard.module').then(m => m.dashboardRoutes)
      },
      {
        path: 'employees',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'HR'] },
        loadChildren: () =>
          import('./features/employees/employees.module').then(m => m.employeeRoutes)
      },
      {
        path: 'departments',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'HR'] },
        loadChildren: () =>
          import('./features/departments/departments.module').then(m => m.departmentRoutes)
      },
      {
        path: 'salary',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'HR'] },
        loadChildren: () =>
          import('./features/salary/salary.module').then(m => m.salaryRoutes)
      },
      {
        path: 'deductions',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'HR'] },
        loadChildren: () =>
          import('./features/deductions/deductions.module').then(m => m.deductionRoutes)
      },
      {
        path: 'bonuses',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'HR'] },
        loadChildren: () =>
          import('./features/bonuses/bonuses.module').then(m => m.bonusRoutes)
      },
      {
        path: 'payroll',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'HR'] },
        loadChildren: () =>
          import('./features/payroll/payroll.module').then(m => m.payrollRoutes)
      },
      {
        path: 'users',
        canActivate: [roleGuard],
        data: { roles: ['Admin'] },
        loadChildren: () =>
          import('./features/users/users.module').then(m => m.userRoutes)
      }
    ]
  },

  // Fallback
  { path: '**', redirectTo: 'dashboard' }
];