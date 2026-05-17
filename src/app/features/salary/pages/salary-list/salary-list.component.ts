import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalaryService } from '../../../../core/services/salary.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';
import {
  SalaryDTO,
  SalaryRevisionDTO,
} from '../../../../core/models/salary.model';
import { EmployeeDTO } from '../../../../core/models/employee.model';

@Component({
  selector: 'app-salary-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './salary-list.component.html',
  styleUrl: './salary-list.component.scss',
})
export class SalaryListComponent implements OnInit {
  salaries: SalaryDTO[] = [];
  employees: EmployeeDTO[] = [];
  selected: SalaryDTO | null = null;
  loading = false;
  saving = false;
  showCreateModal = false;
  showEditModal = false;
  showReviseModal = false;
  successMsg = '';
  errorMsg = '';

  createDto: SalaryDTO = this.emptyDto();
  editDto: SalaryDTO = this.emptyDto();

  reviseDto: SalaryRevisionDTO = {
    revisionId: 0,
    employeeId: 0,
    oldSalary: 0,
    newSalary: 0,
    reason: '',
    revisedBy: 0,
    createdAt: '',
  };

  constructor(
    private salaryService: SalaryService,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.load();
    this.loadEmployees();
  }

  emptyDto(): SalaryDTO {
    return {
      salaryId: 0,
      employeeId: 0,
      basicSalary: 0,
      houseAllowance: 0,
      medicalAllowance: 0,
      transportAllowance: 0,
      grossSalary: 0,
      isActive: true,
      remarks: '',
      createdAt: '',
    };
  }

  load(): void {
    this.loading = true;
    this.salaryService.getAll().subscribe({
      next: (res) => {
        this.salaries = res;
        this.loading = false;
      },
      error: () => {
        this.salaries = [];
        this.selected = null;
        this.loading = false;
      },
    });
  }

  loadEmployees(): void {
    this.employeeService.getAll().subscribe({
      next: (res) => (this.employees = res),
      error: () => (this.employees = []),
    });
  }

  getEmployeeName(id: number): string {
    const emp = this.employees.find((e) => e.employeeId === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : `Employee #${id}`;
  }

  getInitials(id: number): string {
    const emp = this.employees.find((e) => e.employeeId === id);
    return emp
      ? (emp.firstName.charAt(0) + emp.lastName.charAt(0)).toUpperCase()
      : '??';
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

  openCreate(): void {
    this.createDto = this.emptyDto();
    this.errorMsg = '';
    this.showCreateModal = true;
  }

  create(): void {
    if (!this.createDto.employeeId || this.createDto.basicSalary <= 0) {
      this.errorMsg = 'Employee and basic salary are required.';
      this.toastService.error(this.errorMsg);
      return;
    }
    this.saving = true;
    this.salaryService.create(this.createDto).subscribe({
      next: () => {
        this.toastService.success('Salary created.');
        this.showCreateModal = false;
        this.load();
        this.saving = false;
      },
      error: (err) => {
        this.errorMsg = err.error ?? 'Failed.';
        this.toastService.error(this.errorMsg);
        this.saving = false;
      },
    });
  }

  openEdit(s: SalaryDTO): void {
    this.editDto = { ...s };
    this.errorMsg = '';
    this.showEditModal = true;
  }

  update(): void {
    if (this.editDto.basicSalary <= 0) {
      this.errorMsg = 'Basic salary must be greater than zero.';
      this.toastService.error(this.errorMsg);
      return;
    }
    this.saving = true;
    this.salaryService.update(this.editDto).subscribe({
      next: () => {
        this.toastService.success('Salary updated.');
        this.showEditModal = false;
        this.load();
        this.saving = false;
      },
      error: (err) => {
        this.errorMsg = err.error ?? 'Failed.';
        this.toastService.error(this.errorMsg);
        this.saving = false;
      },
    });
  }

  openRevise(s: SalaryDTO): void {
    this.reviseDto = {
      revisionId: 0,
      employeeId: s.employeeId,
      oldSalary: s.basicSalary,
      newSalary: 0,
      reason: '',
      revisedBy: this.authService.getUserId(),
      createdAt: '',
    };
    this.errorMsg = '';
    this.showReviseModal = true;
  }

  revise(): void {
    if (this.reviseDto.newSalary <= 0) {
      this.errorMsg = 'New salary must be greater than zero.';
      this.toastService.error(this.errorMsg);
      return;
    }
    this.saving = true;
    this.salaryService.revise(this.reviseDto).subscribe({
      next: () => {
        this.toastService.success('Salary revised successfully.');
        this.showReviseModal = false;
        this.load();
        this.saving = false;
      },
      error: (err) => {
        this.errorMsg = err.error ?? 'Failed.';
        this.toastService.error(this.errorMsg);
        this.saving = false;
      },
    });
  }

  delete(id: number): void {
    if (!confirm('Delete this salary record?')) return;
    this.salaryService.delete(id).subscribe({
      next: () => {
        this.toastService.success('Deleted.');
        this.salaries = this.salaries.filter(salary => salary.salaryId !== id);
        if (this.selected?.salaryId === id) {
          this.selected = null;
        }
      },
      error: () => {
        this.errorMsg = 'Failed to delete.';
        this.toastService.error(this.errorMsg);
      },
    });
  }
}
