import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';
import { AssignRoleDTO } from '../../../../core/models/auth.model';
import { UserDTO } from '../../../../core/models/user.model';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  showRoleModal = false;
  loading = false;
  saving = false;
  successMsg = '';
  errorMsg = '';
  roles = ['Admin', 'HR', 'Employee'];
  users: UserDTO[] = [];

  assignDto: AssignRoleDTO = { userId: 0, role: 'Employee' };
  selectedUser: UserDTO | null = null;

  // Change password
  showPasswordModal = false;
  changePasswordDto = {
    userId: 0,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  passwordError = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (res) => {
        this.users = res;
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = this.getErrorMessage(err.error);
        this.toastService.error(this.errorMsg);
        this.users = [];
        this.loading = false;
      },
    });
  }

  onUserSelected(userId: number): void {
    const normalizedUserId = Number(userId);
    this.selectedUser =
      this.users.find((user) => user.userId === normalizedUserId) ?? null;
    this.assignDto = {
      userId: normalizedUserId,
      role: this.selectedUser?.role ?? 'Employee',
    };
    this.errorMsg = '';
  }

  assignRole(): void {
    if (!this.assignDto.userId) {
      this.errorMsg = 'Login User ID is required.';
      this.toastService.error(this.errorMsg);
      return;
    }

    if (this.isCurrentUserTarget()) {
      this.errorMsg = 'You cannot change your own role.';
      this.toastService.error(this.errorMsg);
      return;
    }

    this.saving = true;
    this.authService.assignRole(this.assignDto).subscribe({
      next: () => {
        this.toastService.success(
          `Role updated for ${this.getTargetDisplayName()}.`,
        );
        if (this.selectedUser) {
          this.selectedUser = {
            ...this.selectedUser,
            role: this.assignDto.role,
          };
        }
        this.users = this.users.map((user) =>
          user.userId === this.assignDto.userId
            ? { ...user, role: this.assignDto.role }
            : user,
        );
        this.saving = false;
      },
      error: (err) => {
        this.errorMsg = err.error ?? 'Failed.';
        this.toastService.error(this.errorMsg);
        this.saving = false;
      },
    });
  }

  openChangePassword(): void {
    this.changePasswordDto = {
      userId: this.authService.getUserId(),
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
    this.passwordError = '';
    this.showPasswordModal = true;
  }

  changePassword(): void {
    if (!this.changePasswordDto.userId) {
      this.passwordError = 'User session not found. Please log in again.';
      this.toastService.error(this.passwordError);
      return;
    }
    if (!this.changePasswordDto.currentPassword) {
      this.passwordError = 'Current password is required.';
      this.toastService.error(this.passwordError);
      return;
    }
    if (!this.changePasswordDto.newPassword) {
      this.passwordError = 'New password is required.';
      this.toastService.error(this.passwordError);
      return;
    }
    if (
      this.changePasswordDto.newPassword !==
      this.changePasswordDto.confirmPassword
    ) {
      this.passwordError = 'Passwords do not match.';
      this.toastService.error(this.passwordError);
      return;
    }
    if (this.changePasswordDto.newPassword.length < 6) {
      this.passwordError = 'Password must be at least 6 characters.';
      this.toastService.error(this.passwordError);
      return;
    }
    this.saving = true;
    this.authService
      .changePassword({
        userId: this.changePasswordDto.userId,
        currentPassword: this.changePasswordDto.currentPassword,
        newPassword: this.changePasswordDto.newPassword,
      })
      .subscribe({
        next: () => {
          this.toastService.success('Password changed successfully.');
          this.showPasswordModal = false;
          this.saving = false;
        },
        error: (err) => {
          this.passwordError = this.getErrorMessage(err.error);
          this.toastService.error(this.passwordError);
          this.saving = false;
        },
      });
  }

  toggleActive(user: UserDTO): void {
    if (user.userId === this.authService.getUserId()) {
      this.toastService.error('You cannot change your own active status.');
      return;
    }

    this.saving = true;
    this.userService.toggleActive(user.userId).subscribe({
      next: () => {
        user.isActive = !user.isActive;
        this.users = this.users.map((item) =>
          item.userId === user.userId
            ? { ...item, isActive: user.isActive }
            : item,
        );
        if (this.selectedUser?.userId === user.userId) {
          this.selectedUser = { ...this.selectedUser, isActive: user.isActive };
        }
        this.toastService.success('User status updated successfully.');
        this.saving = false;
      },
      error: (err) => {
        this.errorMsg = this.getErrorMessage(err.error);
        this.toastService.error(this.errorMsg);
        this.saving = false;
      },
    });
  }

  getRoleClass(role: string): string {
    const map: Record<string, string> = {
      Admin: 'admin',
      HR: 'hr',
      Employee: 'employee',
    };
    return map[role] ?? 'employee';
  }

  getCurrentUsername(): string {
    return this.authService.getUsername();
  }

  getCurrentRole(): string {
    return this.authService.getRole();
  }

  isCurrentUserTarget(): boolean {
    return this.isCurrentUser(this.assignDto.userId);
  }

  isCurrentUser(userId: number): boolean {
    return userId === this.authService.getUserId();
  }

  getTargetDisplayName(): string {
    return this.selectedUser?.username || `User #${this.assignDto.userId}`;
  }

  private getErrorMessage(error: unknown): string {
    if (typeof error === 'string') return error.replace(/^"|"$/g, '');
    if (error && typeof error === 'object' && 'message' in error) {
      return String((error as { message: string }).message);
    }
    if (error && typeof error === 'object' && 'Message' in error) {
      return String((error as { Message: string }).Message);
    }
    return 'Failed.';
  }
}
