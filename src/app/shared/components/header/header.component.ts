import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  username: string;
  initials: string;
  role: string;

  constructor(private authService: AuthService, private router: Router) {
    this.username = this.authService.getUsername();
    this.role     = this.authService.getRole();
    this.initials = this.username.slice(0, 2).toUpperCase();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {},
      error: () => this.authService.clearSession()
    });
  }
}