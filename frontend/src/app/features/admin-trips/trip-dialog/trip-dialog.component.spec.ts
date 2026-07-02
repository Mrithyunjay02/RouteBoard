import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDialogComponent } from './trip-dialog.component';

describe('TripDialogComponent', () => {
  let component: TripDialogComponent;
  let fixture: ComponentFixture<TripDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
