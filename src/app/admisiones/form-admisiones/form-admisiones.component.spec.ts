import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAdmisionesComponent } from './form-admisiones.component';

describe('FormAdmisionesComponent', () => {
  let component: FormAdmisionesComponent;
  let fixture: ComponentFixture<FormAdmisionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAdmisionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAdmisionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
