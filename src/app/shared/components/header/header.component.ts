import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
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
  pageName = 'Dashboard';

  constructor(private authService: AuthService, private router: Router) {
    this.username = this.authService.getUsername();
    this.role     = this.authService.getRole();
    this.initials = this.username.slice(0, 2).toUpperCase();
    this.setPageName(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => this.setPageName((event as NavigationEnd).urlAfterRedirects));
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.authService.clearSession(),
      error: () => this.authService.clearSession()
    });
  }

  private setPageName(url: string): void {
    const cleanUrl = url.split('?')[0];
    const map: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/employees': 'Employees',
      '/employees/create': 'Employees',
      '/departments': 'Departments',
      '/salary': 'Salary',
      '/salary/revisions': 'Revision History',
      '/deductions': 'Deductions',
      '/bonuses': 'Bonuses',
      '/payroll': 'Payroll',
      '/users': 'Auth & Users',
    };

    this.pageName = map[cleanUrl] ?? (cleanUrl.includes('/employees/edit') ? 'Employees' : 'Dashboard');
  }
}
