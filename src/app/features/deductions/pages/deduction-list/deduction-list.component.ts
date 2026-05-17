import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeductionService } from '../../../../core/services/deduction.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { DeductionDTO } from '../../../../core/models/deduction.model';
import { EmployeeDTO } from '../../../../core/models/employee.model';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-deduction-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deduction-list.component.html',
  styleUrl: './deduction-list.component.scss',
})
export class DeductionListComponent implements OnInit {
  deductions: DeductionDTO[] = [];
  filtered: DeductionDTO[] = [];
  employees: EmployeeDTO[] = [];
  loading = false;
  saving = false;
  showModal = false;
  isEdit = false;
  successMsg = '';
  errorMsg = '';

  types = ['Absent', 'Loan', 'Penalty', 'Other'];
  months = [
    { v: 1, l: 'January' },
    { v: 2, l: 'February' },
    { v: 3, l: 'March' },
    { v: 4, l: 'April' },
    { v: 5, l: 'May' },
    { v: 6, l: 'June' },
    { v: 7, l: 'July' },
    { v: 8, l: 'August' },
    { v: 9, l: 'September' },
    { v: 10, l: 'October' },
    { v: 11, l: 'November' },
    { v: 12, l: 'December' },
  ];

  dto: DeductionDTO = this.emptyDto();
  filterType = '';

  constructor(
    private deductionService: DeductionService,
    private employeeService: EmployeeService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.load();
    this.loadEmployees();
  }

  emptyDto(): DeductionDTO {
    const now = new Date();
    return {
      deductionId: 0,
      employeeId: 0,
      deductionType: 'Absent',
      amount: 0,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      reason: '',
      createdAt: '',
    };
  }

  load(): void {
    this.loading = true;
    this.deductionService.getAll().subscribe({
      next: (res) => {
        this.deductions = res;
        this.filtered = res;
        this.loading = false;
      },
      error: () => {
        this.deductions = [];
        this.filtered = [];
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

  applyFilter(): void {
    this.filtered = this.filterType
      ? this.deductions.filter((d) => d.deductionType === this.filterType)
      : [...this.deductions];
  }

  getEmployeeName(id: number): string {
    const e = this.employees.find((x) => x.employeeId === id);
    return e ? `${e.firstName} ${e.lastName}` : `#${id}`;
  }

  getMonthName(m: number): string {
    return this.months.find((x) => x.v === m)?.l ?? '';
  }

  getTypeClass(type: string): string {
    const map: Record<string, string> = {
      Absent: 'inactive',
      Loan: 'leave',
      Penalty: 'terminated',
      Other: 'draft',
    };
    return map[type] ?? 'draft';
  }

  openCreate(): void {
    this.isEdit = false;
    this.dto = this.emptyDto();
    this.errorMsg = '';
    this.showModal = true;
  }

  openEdit(d: DeductionDTO): void {
    this.isEdit = true;
    this.dto = { ...d };
    this.errorMsg = '';
    this.showModal = true;
  }

  save(): void {
    if (!this.dto.employeeId || this.dto.amount <= 0) {
      this.errorMsg = 'Employee and amount are required.';
      this.toastService.error(this.errorMsg);
      return;
    }
    this.saving = true;
    const req = this.isEdit
      ? this.deductionService.update(this.dto)
      : this.deductionService.create(this.dto);
    req.subscribe({
      next: () => {
        this.toastService.success(
          this.isEdit ? 'Updated.' : 'Deduction added.',
        );
        this.showModal = false;
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
    if (!confirm('Delete this deduction?')) return;
    this.deductionService.delete(id).subscribe({
      next: () => {
        this.toastService.success('Deleted.');
        this.deductions = this.deductions.filter(
          deduction => deduction.deductionId !== id
        );
        this.applyFilter();
      },
      error: () => {
        this.errorMsg = 'Failed to delete.';
        this.toastService.error(this.errorMsg);
      },
    });
  }
}
