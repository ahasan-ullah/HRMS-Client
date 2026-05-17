import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalaryService } from '../../../../core/services/salary.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { SalaryRevisionDTO } from '../../../../core/models/salary.model';
import { EmployeeDTO } from '../../../../core/models/employee.model';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-salary-revision-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './salary-revision-history.component.html',
  styleUrl: './salary-revision-history.component.scss',
})
export class SalaryRevisionHistoryComponent implements OnInit {
  revisions: SalaryRevisionDTO[] = [];
  employees: EmployeeDTO[] = [];
  selectedEmployeeId = 0;
  loading = false;
  errorMsg = '';

  constructor(
    private salaryService: SalaryService,
    private employeeService: EmployeeService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getAll().subscribe({
      next: (res) => (this.employees = res),
      error: () => {},
    });
  }

  loadRevisions(): void {
    if (!this.selectedEmployeeId) return;
    this.loading = true;
    this.revisions = [];
    this.salaryService.getRevisionHistory(this.selectedEmployeeId).subscribe({
      next: (res) => {
        this.revisions = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'No revision history found.';
        this.toastService.error(this.errorMsg);
      },
    });
  }

  getEmployeeName(id: number): string {
    const emp = this.employees.find((e) => e.employeeId === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : `Employee #${id}`;
  }

  getDifference(rev: SalaryRevisionDTO): number {
    return rev.newSalary - rev.oldSalary;
  }

  getPercentChange(rev: SalaryRevisionDTO): string {
    if (rev.oldSalary === 0) return '—';
    const pct = ((rev.newSalary - rev.oldSalary) / rev.oldSalary) * 100;
    return (pct > 0 ? '+' : '') + pct.toFixed(1) + '%';
  }
}
