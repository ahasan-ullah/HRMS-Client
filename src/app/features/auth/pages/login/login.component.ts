import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginDTO } from '../../../../core/models/auth.model';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  dto: LoginDTO = { username: '', password: '' };
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
  ) {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  login(): void {
    if (!this.dto.username || !this.dto.password) {
      this.error = 'Username and password are required.';
      this.toastService.error(this.error);
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.dto).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => {
        this.error = this.getLoginErrorMessage(err);
        this.toastService.error(this.error);
        this.loading = false;
      }
    });
  }

  onEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.login();
  }

  private getLoginErrorMessage(err: any): string {
    if (typeof err?.error === 'string') {
      return err.error.includes('<!DOCTYPE html>')
        ? 'Login service is not reachable. Please make sure the API server is running.'
        : err.error;
    }

    return err?.error?.message ?? err?.message ?? 'Invalid username or password.';
  }
}
