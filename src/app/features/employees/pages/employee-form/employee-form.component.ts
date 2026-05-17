import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../../../core/services/employee.service';
import { DepartmentService } from '../../../../core/services/department.service';
import { EmployeeDTO } from '../../../../core/models/employee.model';
import { DepartmentDTO } from '../../../../core/models/department.model';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss'
})
export class EmployeeFormComponent implements OnInit {
  isEdit = false;
  employeeId = 0;
  loading = false;
  saving = false;
  errorMsg = '';
  departments: DepartmentDTO[] = [];

  dto: EmployeeDTO = {
    employeeId: 0,
    departmentId: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    position: '',
    accountNumber: '',
    employmentStatus: 'Active',
    joiningDate: new Date().toISOString().split('T')[0],
    isActive: true,
    createdAt: new Date().toISOString()
  };

  statuses = ['Active', 'Inactive', 'OnLeave', 'Terminated'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.employeeId = parseInt(id);
      this.loadEmployee();
    }
  }

  loadDepartments(): void {
    this.departmentService.getAll().subscribe({
      next: res => this.departments = res,
      error: () => this.departments = []
    });
  }

  loadEmployee(): void {
    this.loading = true;
    this.employeeService.getById(this.employeeId).subscribe({
      next: res => {
        this.dto = {
          ...res,
          joiningDate: res.joiningDate
            ? new Date(res.joiningDate).toISOString().split('T')[0]
            : ''
        };
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load employee.';
        this.toastService.error(this.errorMsg);
        this.loading = false;
      }
    });
  }

  save(): void {
    if (!this.dto.firstName || !this.dto.lastName ||
        !this.dto.email || !this.dto.departmentId) {
      this.errorMsg = 'Please fill all required fields.';
      this.toastService.error(this.errorMsg);
      return;
    }

    this.saving = true;
    this.errorMsg = '';

    const request = this.isEdit
      ? this.employeeService.update(this.dto)
      : this.employeeService.create(this.dto);

    request.subscribe({
      next: () => {
        this.toastService.success(
          this.isEdit ? 'Employee updated successfully.' : 'Employee created successfully.',
        );
        this.router.navigate(['/employees']);
      },
      error: err => {
        this.errorMsg = err.error ?? 'Failed to save employee.';
        this.toastService.error(this.errorMsg);
        this.saving = false;
      }
    });
  }
}
