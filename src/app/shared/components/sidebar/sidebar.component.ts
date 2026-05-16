import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  role: string;

  mainNav: NavItem[] = [
    { label: 'Dashboard', icon: 'ti-layout-dashboard', route: '/dashboard' }
  ];

  peopleNav: NavItem[] = [
    { label: 'Employees', icon: 'ti-users', route: '/employees', roles: ['Admin', 'HR'] },
    { label: 'Departments', icon: 'ti-building', route: '/departments', roles: ['Admin', 'HR'] }
  ];

  compensationNav: NavItem[] = [
    { label: 'Salary', icon: 'ti-cash', route: '/salary', roles: ['Admin', 'HR'] },
    { label: 'Revision History', icon: 'ti-history', route: '/salary/revisions', roles: ['Admin', 'HR'] },
    { label: 'Deductions', icon: 'ti-minus', route: '/deductions', roles: ['Admin', 'HR'] },
    { label: 'Bonuses', icon: 'ti-gift', route: '/bonuses', roles: ['Admin', 'HR'] }
  ];

  payrollNav: NavItem[] = [
    { label: 'Payroll', icon: 'ti-report-money', route: '/payroll', roles: ['Admin', 'HR'] }
  ];

  systemNav: NavItem[] = [
    { label: 'Auth & Users', icon: 'ti-shield-lock', route: '/users', roles: ['Admin'] }
  ];

  constructor(private authService: AuthService) {
    this.role = this.authService.getRole();
  }

  canSee(item: NavItem): boolean {
    if (!item.roles || item.roles.length === 0) return true;
    return item.roles.includes(this.role);
  }
}