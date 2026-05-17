import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PayrollService } from '../../../../core/services/payroll.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';
import {
  PayrollDTO,
  PayrollDetailDTO,
  GeneratePayrollDTO,
} from '../../../../core/models/payroll.model';

@Component({
  selector: 'app-payroll-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payroll-list.component.html',
  styleUrl: './payroll-list.component.scss',
})
export class PayrollListComponent implements OnInit {
  payrolls: PayrollDTO[] = [];
  details: PayrollDetailDTO[] = [];
  selected: PayrollDTO | null = null;
  loading = false;
  detailLoading = false;
  saving = false;
  showGenerateModal = false;
  successMsg = '';
  errorMsg = '';
  isAdmin = false;

  generateDto: GeneratePayrollDTO = {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    generatedBy: 0,
  };

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

  constructor(
    private payrollService: PayrollService,
    private authService: AuthService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.generateDto.generatedBy = this.authService.getUserId();
    this.load();
  }

  load(): void {
    this.loading = true;
    this.payrollService.getAll().subscribe({
      next: (res) => {
        this.payrolls = res;
        this.loading = false;
      },
      error: () => {
        this.payrolls = [];
        this.selected = null;
        this.details = [];
        this.loading = false;
      },
    });
  }

  selectPayroll(p: PayrollDTO): void {
    this.selected = p;
    this.detailLoading = true;
    this.details = [];
    this.payrollService.getDetails(p.payrollId).subscribe({
      next: (res) => {
        this.details = res;
        this.detailLoading = false;
      },
      error: () => {
        this.details = [];
        this.detailLoading = false;
      },
    });
  }

  generate(): void {
    this.saving = true;
    this.errorMsg = '';
    this.payrollService.generate(this.generateDto).subscribe({
      next: () => {
        this.toastService.success('Payroll generated successfully.');
        this.showGenerateModal = false;
        this.load();
        this.saving = false;
      },
      error: (err) => {
        this.errorMsg = err.error ?? 'Failed to generate.';
        this.toastService.error(this.errorMsg);
        this.saving = false;
      },
    });
  }

  approve(id: number): void {
    if (!confirm('Approve this payroll?')) return;
    this.payrollService.approve(id).subscribe({
      next: () => {
        this.toastService.success('Payroll approved.');
        this.load();
      },
      error: (err) => {
        this.errorMsg = err.error ?? 'Failed.';
        this.toastService.error(this.errorMsg);
      },
    });
  }

  markPaid(id: number): void {
    if (!confirm('Mark this payroll as Paid?')) return;
    this.payrollService.markAsPaid(id).subscribe({
      next: () => {
        this.toastService.success('Marked as paid.');
      },
      error: (err) => {
        this.errorMsg = err.error ?? 'Failed.';
        this.toastService.error(this.errorMsg);
      },
    });
  }

  delete(id: number): void {
    if (!confirm('Delete this draft payroll?')) return;
    this.payrollService.delete(id).subscribe({
      next: () => {
        this.toastService.success('Deleted.');
        this.payrolls = this.payrolls.filter(payroll => payroll.payrollId !== id);
        if (this.selected?.payrollId === id) {
          this.selected = null;
          this.details = [];
        }
      },
      error: (err) => {
        this.errorMsg = err.error ?? 'Failed.';
        this.toastService.error(this.errorMsg);
      },
    });
  }

  getMonthName(m: number): string {
    return this.months.find((x) => x.v === m)?.l ?? '';
  }

  getStatusClass(s: string): string {
    const map: Record<string, string> = {
      Draft: 'draft',
      Approved: 'approved',
      Paid: 'paid',
    };
    return map[s] ?? 'draft';
  }

  getPaymentClass(s: string): string {
    return s === 'Paid' ? 'paid' : 'pending';
  }
}
