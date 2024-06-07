import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitionsComponent } from './requisitions.component';

describe('RequisitionsComponent', () => {
  let component: RequisitionsComponent;
  let fixture: ComponentFixture<RequisitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequisitionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequisitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
