export interface SalaryDTO {
  salaryId: number;
  employeeId: number;
  basicSalary: number;
  houseAllowance: number;
  medicalAllowance: number;
  transportAllowance: number;
  grossSalary: number;
  isActive: boolean;
  remarks: string;
  createdAt: string;
}

export interface SalaryRevisionDTO {
  revisionId: number;
  employeeId: number;
  oldSalary: number;
  newSalary: number;
  reason: string;
  revisedBy: number;
  createdAt: string;
}