import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EmployeeService } from '../../../../core/services/employee.service';
import { DepartmentService } from '../../../../core/services/department.service';
import { EmployeeDTO } from '../../../../core/models/employee.model';
import { DepartmentDTO } from '../../../../core/models/department.model';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent implements OnInit {
  employees: EmployeeDTO[] = [];
  filtered: EmployeeDTO[] = [];
  departments: DepartmentDTO[] = [];
  loading = true;
  keyword = '';
  selectedDept = 0;
  showDeleteModal = false;
  selectedId = 0;
  successMsg = '';
  errorMsg = '';

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private toastService: ToastService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.keyword = this.route.snapshot.queryParamMap.get('search') ?? '';
    this.loadEmployees();
    this.loadDepartments();
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getAll().subscribe({
      next: (res) => {
        this.employees = res;
        this.filtered = res;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.employees = [];
        this.filtered = [];
        this.loading = false;
      },
    });
  }

  loadDepartments(): void {
    this.departmentService.getAll().subscribe({
      next: (res) => (this.departments = res),
      error: () => (this.departments = []),
    });
  }

  applyFilters(): void {
    let data = [...this.employees];

    if (this.keyword.trim()) {
      const kw = this.keyword.toLowerCase();
      data = data.filter(
        (e) =>
          e.firstName.toLowerCase().includes(kw) ||
          e.lastName.toLowerCase().includes(kw) ||
          e.email.toLowerCase().includes(kw) ||
          e.position.toLowerCase().includes(kw),
      );
    }

    const departmentId = Number(this.selectedDept);
    if (departmentId > 0) {
      data = data.filter((e) => Number(e.departmentId) === departmentId);
    }

    this.filtered = data;
  }

  onSearch(): void {
    this.applyFilters();
  }

  onDeptChange(): void {
    this.applyFilters();
  }

  confirmDelete(id: number): void {
    this.selectedId = id;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.selectedId = 0;
  }

  deleteEmployee(): void {
    this.employeeService.delete(this.selectedId).subscribe({
      next: () => {
        this.toastService.success('Employee deleted successfully.');
        this.employees = this.employees.filter(
          emp => emp.employeeId !== this.selectedId
        );
        this.applyFilters();
        this.showDeleteModal = false;
        this.selectedId = 0;
      },
      error: () => {
        this.toastService.error('Failed to delete employee.');
        this.showDeleteModal = false;
        this.selectedId = 0;
      },
    });
  }

  getInitials(f: string, l: string): string {
    return (f?.charAt(0) ?? '') + (l?.charAt(0) ?? '');
  }

  getAvatarColor(index: number): string {
    const colors = [
      '#071a3d',
      '#416fb5',
      '#D85A30',
      '#D4537E',
      '#7F77DD',
      '#EF9F27',
    ];
    return colors[index % colors.length];
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      Active: 'active',
      Inactive: 'inactive',
      OnLeave: 'leave',
      Terminated: 'terminated',
    };
    return map[status] ?? 'inactive';
  }
}
