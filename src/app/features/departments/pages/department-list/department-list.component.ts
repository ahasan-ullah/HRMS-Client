import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../../../../core/services/department.service';
import { DepartmentDTO } from '../../../../core/models/department.model';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.scss',
})
export class DepartmentListComponent implements OnInit {
  departments: DepartmentDTO[] = [];
  loading = false;
  saving = false;
  showModal = false;
  showDeleteModal = false;
  isEdit = false;
  selectedId = 0;
  successMsg = '';
  errorMsg = '';

  dto: DepartmentDTO = this.emptyDto();

  deptIcons = [
    'ti-code',
    'ti-users',
    'ti-cash',
    'ti-palette',
    'ti-speakerphone',
    'ti-headset',
    'ti-building',
  ];
  deptColors = [
    '#E1F5EE',
    '#E6F1FB',
    '#FAEEDA',
    '#F0EBFC',
    '#FCEBEB',
    '#F8F7F3',
    '#E8E6DF',
  ];
  deptIconColors = [
    '#071a3d',
    '#185FA5',
    '#854F0B',
    '#5B3A9E',
    '#A32D2D',
    '#888780',
    '#888780',
  ];

  constructor(
    private departmentService: DepartmentService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.departmentService.getAll().subscribe({
      next: (res) => {
        this.departments = res;
        this.loading = false;
      },
      error: () => {
        this.departments = [];
        this.loading = false;
      },
    });
  }

  openCreate(): void {
    this.isEdit = false;
    this.dto = this.emptyDto();
    this.errorMsg = '';
    this.showModal = true;
  }

  openEdit(dept: DepartmentDTO): void {
    this.isEdit = true;
    this.dto = { ...dept };
    this.errorMsg = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.errorMsg = '';
  }

  save(): void {
    if (!this.dto.name.trim()) {
      this.errorMsg = 'Department name is required.';
      this.toastService.error(this.errorMsg);
      return;
    }

    this.saving = true;
    this.errorMsg = '';

    const payload: DepartmentDTO = {
      ...this.dto,
      createdAt: this.dto.createdAt || new Date().toISOString(),
    };

    const request = this.isEdit
      ? this.departmentService.update(payload)
      : this.departmentService.create(payload);

    request.subscribe({
      next: () => {
        this.toastService.success(
          this.isEdit ? 'Department updated.' : 'Department created.',
        );
        this.showModal = false;
        this.load();
        this.saving = false;
      },
      error: (err) => {
        this.errorMsg = this.getErrorMessage(err.error);
        this.toastService.error(this.errorMsg);
        this.saving = false;
      },
    });
  }

  confirmDelete(id: number): void {
    this.selectedId = id;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.selectedId = 0;
  }

  deleteDepartment(): void {
    const deletedId = this.selectedId;
    this.departmentService.delete(this.selectedId).subscribe({
      next: () => {
        this.toastService.success('Department deleted.');
        this.departments = this.departments.filter(
          dept => dept.departmentId !== deletedId
        );
        this.showDeleteModal = false;
        this.selectedId = 0;
      },
      error: (err) => {
        this.errorMsg = this.getErrorMessage(err.error);
        this.toastService.error(this.errorMsg);
        this.showDeleteModal = false;
        this.selectedId = 0;
      },
    });
  }

  getIcon(index: number): string {
    return this.deptIcons[index % this.deptIcons.length];
  }

  getColor(index: number): string {
    return this.deptColors[index % this.deptColors.length];
  }

  getIconColor(index: number): string {
    return this.deptIconColors[index % this.deptIconColors.length];
  }

  private emptyDto(): DepartmentDTO {
    return {
      departmentId: 0,
      name: '',
      description: '',
      createdAt: new Date().toISOString(),
      employeeCount: 0,
    };
  }

  private getErrorMessage(error: unknown): string {
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object' && 'Message' in error) {
      return String((error as { Message: string }).Message);
    }
    return 'Failed to save.';
  }
}
