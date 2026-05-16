export interface PayrollDTO {
  payrollId: number;
  payrollMonth: number;
  payrollYear: number;
  generatedDate: string;
  generatedBy: number;
  totalAmount: number;
  status: string;
}

export interface PayrollDetailDTO {
  payrollDetailId: number;
  payrollId: number;
  employeeId: number;
  basicSalary: number;
  totalAllowances: number;
  bonusAmount: number;
  totalDeductions: number;
  taxAmount: number;
  grossSalary: number;
  netSalary: number;
  paymentStatus: string;
}

export interface GeneratePayrollDTO {
  month: number;
  year: number;
  generatedBy: number;
}