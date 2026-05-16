export interface UserDTO {
  userId: number;
  username: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}