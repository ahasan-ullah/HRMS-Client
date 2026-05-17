import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BonusService } from '../../../../core/services/bonus.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { BonusDTO } from '../../../../core/models/bonus.model';
import { EmployeeDTO } from '../../../../core/models/employee.model';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-bonus-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bonus-list.component.html',
  styleUrl: './bonus-list.component.scss',
})
export class BonusListComponent implements OnInit {
  bonuses: BonusDTO[] = [];
  filtered: BonusDTO[] = [];
  employees: EmployeeDTO[] = [];
  loading = false;
  saving = false;
  showModal = false;
  isEdit = false;
  successMsg = '';
  errorMsg = '';
  filterType = '';

  types = ['Festival', 'Performance', 'Annual', 'Other'];

  dto: BonusDTO = this.emptyDto();

  constructor(
    private bonusService: BonusService,
    private employeeService: EmployeeService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.load();
    this.loadEmployees();
  }

  emptyDto(): BonusDTO {
    return {
      bonusId: 0,
      employeeId: 0,
      bonusType: 'Performance',
      amount: 0,
      bonusDate: new Date().toISOString().split('T')[0],
      reason: '',
      createdAt: '',
    };
  }

  load(): void {
    this.loading = true;
    this.bonusService.getAll().subscribe({
      next: (res) => {
        this.bonuses = res;
        this.filtered = res;
        this.loading = false;
      },
      error: () => {
        this.bonuses = [];
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
      ? this.bonuses.filter((b) => b.bonusType === this.filterType)
      : [...this.bonuses];
  }

  getEmployeeName(id: number): string {
    const e = this.employees.find((x) => x.employeeId === id);
    return e ? `${e.firstName} ${e.lastName}` : `#${id}`;
  }

  getTypeClass(type: string): string {
    const map: Record<string, string> = {
      Festival: 'leave',
      Performance: 'approved',
      Annual: 'active',
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

  openEdit(b: BonusDTO): void {
    this.isEdit = true;
    this.dto = {
      ...b,
      bonusDate: b.bonusDate
        ? new Date(b.bonusDate).toISOString().split('T')[0]
        : '',
    };
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
      ? this.bonusService.update(this.dto)
      : this.bonusService.create(this.dto);
    req.subscribe({
      next: () => {
        this.toastService.success(this.isEdit ? 'Updated.' : 'Bonus added.');
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
    if (!confirm('Delete this bonus?')) return;
    this.bonusService.delete(id).subscribe({
      next: () => {
        this.toastService.success('Deleted.');
        this.bonuses = this.bonuses.filter(bonus => bonus.bonusId !== id);
        this.applyFilter();
      },
      error: () => {
        this.errorMsg = 'Failed.';
        this.toastService.error(this.errorMsg);
      },
    });
  }
}
