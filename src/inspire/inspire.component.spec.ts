import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspireComponent } from './inspire.component';

describe('InspireComponent', () => {
  let component: InspireComponent;
  let fixture: ComponentFixture<InspireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InspireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InspireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
