import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmicalcComponent } from './emicalc.component';

describe('EmicalcComponent', () => {
  let component: EmicalcComponent;
  let fixture: ComponentFixture<EmicalcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmicalcComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmicalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
