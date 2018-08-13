import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormContrasenaComponent } from './form-contrasena.component';

describe('FormContrasenaComponent', () => {
  let component: FormContrasenaComponent;
  let fixture: ComponentFixture<FormContrasenaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormContrasenaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormContrasenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
