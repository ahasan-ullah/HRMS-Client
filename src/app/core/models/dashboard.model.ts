import { BonusDTO } from './bonus.model';
import { DeductionDTO } from './deduction.model';
import { DepartmentDTO } from './department.model';
import { EmployeeDTO } from './employee.model';
import { PayrollDTO } from './payroll.model';
import { SalaryDTO } from './salary.model';

export interface ManagementDashboardDTO {
  totalEmployees: number;
  activeEmployees: number;
  totalDepartments: number;
  latestPayroll?: PayrollDTO | null;
  payrollsGenerated: number;
  paidPayrolls: number;
  recentEmployees: EmployeeDTO[];
  payrolls: PayrollDTO[];
}

export interface EmployeeDashboardDTO {
  employee?: EmployeeDTO | null;
  department?: DepartmentDTO | null;
  salary?: SalaryDTO | null;
  bonuses: BonusDTO[];
  deductions: DeductionDTO[];
}
