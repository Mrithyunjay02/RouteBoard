import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripHistoryDialogComponent } from './trip-history-dialog.component';

describe('TripHistoryDialogComponent', () => {
  let component: TripHistoryDialogComponent;
  let fixture: ComponentFixture<TripHistoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripHistoryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
