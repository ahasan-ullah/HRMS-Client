import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryRevisionHistoryComponent } from './salary-revision-history.component';

describe('SalaryRevisionHistoryComponent', () => {
  let component: SalaryRevisionHistoryComponent;
  let fixture: ComponentFixture<SalaryRevisionHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryRevisionHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalaryRevisionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
