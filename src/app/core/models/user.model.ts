export interface UserDTO {
  userId: number;
  employeeId?: number | null;
  username: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}
