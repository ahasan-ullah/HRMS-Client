import { Routes } from '@angular/router';
import { SalaryListComponent } from './pages/salary-list/salary-list.component';
import { SalaryRevisionHistoryComponent } from './pages/salary-revision-history/salary-revision-history.component';

export const salaryRoutes: Routes = [
  { path: '', component: SalaryListComponent },
  { path: 'revisions', component: SalaryRevisionHistoryComponent }
];