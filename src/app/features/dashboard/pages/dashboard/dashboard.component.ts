import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { PayrollService } from '../../../../core/services/payroll.service';
import { DepartmentService } from '../../../../core/services/department.service';
import { SalaryService } from '../../../../core/services/salary.service';
import { BonusService } from '../../../../core/services/bonus.service';
import { DeductionService } from '../../../../core/services/deduction.service';
import { EmployeeDTO } from '../../../../core/models/employee.model';
import { PayrollDTO } from '../../../../core/models/payroll.model';
import { DepartmentDTO } from '../../../../core/models/department.model';
import { SalaryDTO } from '../../../../core/models/salary.model';
import { BonusDTO } from '../../../../core/models/bonus.model';
import { DeductionDTO } from '../../../../core/models/deduction.model';
import {
  EmployeeDashboardDTO,
  ManagementDashboardDTO
} from '../../../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  username = '';
  role = '';
  loading = true;

  employees: EmployeeDTO[] = [];
  recentEmployees: EmployeeDTO[] = [];
  payrolls: PayrollDTO[] = [];
  totalEmployees = 0;
  activeEmployees = 0;
  totalDepartments = 0;
  latestPayroll: PayrollDTO | null = null;
  paidPayrolls = 0;

  employee: EmployeeDTO | null = null;
  employeeDepartment: DepartmentDTO | null = null;
  employeeSalary: SalaryDTO | null = null;
  employeeBonuses: BonusDTO[] = [];
  employeeDeductions: DeductionDTO[] = [];

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private employeeService: EmployeeService,
    private payrollService: PayrollService,
    private departmentService: DepartmentService,
    private salaryService: SalaryService,
    private bonusService: BonusService,
    private deductionService: DeductionService,
  ) {
    this.username = this.authService.getUsername();
    this.role = this.authService.getRole();
  }

  ngOnInit(): void {
    if (this.isEmployeeDashboard()) {
      this.loadEmployeeDashboard();
      return;
    }

    this.loadManagementDashboard();
  }

  isEmployeeDashboard(): boolean {
    return this.role === 'Employee';
  }

  loadManagementDashboard(): void {
    const source = this.role === 'HR'
      ? this.dashboardService.getHR()
      : this.dashboardService.getAdmin();

    source.pipe(catchError(() => this.loadManagementFallback())).subscribe({
      next: res => {
        this.applyManagementDashboard(res);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadEmployeeDashboard(): void {
    this.dashboardService.getEmployee()
      .pipe(catchError(() => this.loadEmployeeFallback()))
      .subscribe({
        next: res => {
          this.applyEmployeeDashboard(res);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  private loadManagementFallback() {
    return forkJoin({
      employees: this.employeeService.getAll().pipe(catchError(() => of([] as EmployeeDTO[]))),
      departments: this.departmentService.getAll().pipe(catchError(() => of([] as DepartmentDTO[]))),
      payrolls: this.payrollService.getAll().pipe(catchError(() => of([] as PayrollDTO[]))),
    }).pipe(
      catchError(() => of({ employees: [], departments: [], payrolls: [] })),
      map(data => {
        const payrolls = data.payrolls ?? [];
        return {
          totalEmployees: data.employees?.length ?? 0,
          activeEmployees: data.employees?.filter((e: EmployeeDTO) => e.isActive).length ?? 0,
          totalDepartments: data.departments?.length ?? 0,
          latestPayroll: payrolls[0] ?? null,
          payrollsGenerated: payrolls.length,
          paidPayrolls: payrolls.filter((p: PayrollDTO) => p.status === 'Paid').length,
          recentEmployees: (data.employees ?? []).slice(0, 5),
          payrolls,
        } as ManagementDashboardDTO;
      })
    );
  }

  private loadEmployeeFallback() {
    const employeeId = this.authService.getUserId();

    return this.employeeService.getById(employeeId).pipe(
      catchError(() => of(null)),
      switchMap(employee => {
        if (!employee) {
          return of({
            employee: null,
            department: null,
            salary: null,
            bonuses: [],
            deductions: [],
          } as EmployeeDashboardDTO);
        }

        return forkJoin({
          department: this.departmentService.getById(employee.departmentId).pipe(catchError(() => of(null))),
          salary: this.salaryService.getActiveByEmployee(employee.employeeId).pipe(catchError(() => of(null))),
          bonuses: this.bonusService.getByEmployee(employee.employeeId).pipe(catchError(() => of([] as BonusDTO[]))),
          deductions: this.deductionService.getByEmployee(employee.employeeId).pipe(catchError(() => of([] as DeductionDTO[]))),
        }).pipe(
          catchError(() => of({ department: null, salary: null, bonuses: [], deductions: [] })),
          map(details => ({
            employee,
            department: details.department,
            salary: details.salary,
            bonuses: details.bonuses ?? [],
            deductions: details.deductions ?? [],
          } as EmployeeDashboardDTO))
        );
      })
    );
  }

  private applyManagementDashboard(res: any): void {
    this.employees = res.employees ?? res.recentEmployees ?? [];
    this.recentEmployees = res.recentEmployees ?? this.employees.slice(0, 5);
    this.payrolls = res.payrolls ?? res.payrollHistory ?? [];
    this.totalEmployees = res.totalEmployees ?? this.employees.length ?? 0;
    this.activeEmployees = res.activeEmployees ?? this.employees.filter(e => e.isActive).length ?? this.totalEmployees;
    this.totalDepartments = res.totalDepartments ?? res.departmentCount ?? 0;
    this.latestPayroll = res.latestPayroll ?? this.payrolls[0] ?? null;
    this.paidPayrolls = res.paidPayrolls ?? this.payrolls.filter(p => p.status === 'Paid').length;
  }

  private applyEmployeeDashboard(res: any): void {
    this.employee = res.employee ?? res.employeeDetails ?? res.profile ?? null;
    this.employeeDepartment = res.department ?? res.employeeDepartment ?? null;
    this.employeeSalary = res.salary ?? res.activeSalary ?? null;
    this.employeeBonuses = res.bonuses ?? res.recentBonuses ?? [];
    this.employeeDeductions = res.deductions ?? res.recentDeductions ?? [];
  }

  getInitials(firstName = '', lastName = ''): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'HR';
  }

  getAvatarColor(index: number): string {
    const colors = ['#071a3d', '#416fb5', '#0f766e', '#315f9f', '#1b3c6d'];
    return colors[index % colors.length];
  }

  getStatusClass(status = ''): string {
    const map: Record<string, string> = {
      Active: 'active',
      Inactive: 'inactive',
      OnLeave: 'leave',
      Terminated: 'terminated'
    };
    return map[status] ?? 'inactive';
  }

  getPayrollStatusClass(status = ''): string {
    const map: Record<string, string> = {
      Draft: 'draft',
      Approved: 'approved',
      Paid: 'paid'
    };
    return map[status] ?? 'draft';
  }

  getMonthName(month: number): string {
    if (!month) return 'Month';
    return new Date(2000, month - 1).toLocaleString('default', { month: 'long' });
  }

  totalBonus(): number {
    return this.employeeBonuses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }

  totalDeduction(): number {
    return this.employeeDeductions.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }

  netPay(): number {
    return Number(this.employeeSalary?.grossSalary || 0) + this.totalBonus() - this.totalDeduction();
  }
}
