export interface LoginDTO {
  username: string;
  password: string;
}

export interface TokenResponseDTO {
  accessToken: string;
  refreshToken: string;
  expiresInMinutes: number;
  role: string;
  userId: number;
  username: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface ChangePasswordDTO {
  userId: number;
  currentPassword: string;
  newPassword: string;
}

export interface AssignRoleDTO {
  userId: number;
  role: string;
}
