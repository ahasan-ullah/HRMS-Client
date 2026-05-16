export interface DeductionDTO {
  deductionId: number;
  employeeId: number;
  deductionType: string;
  amount: number;
  month: number;
  year: number;
  reason: string;
  createdAt: string;
}