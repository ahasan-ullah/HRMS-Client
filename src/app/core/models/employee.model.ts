export interface EmployeeDTO {
  employeeId: number;
  departmentId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  position: string;
  accountNumber: string;
  employmentStatus: string;
  joiningDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}