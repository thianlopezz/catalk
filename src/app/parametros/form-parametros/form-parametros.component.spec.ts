import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormParametrosComponent } from './form-parametros.component';

describe('FormParametrosComponent', () => {
  let component: FormParametrosComponent;
  let fixture: ComponentFixture<FormParametrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormParametrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormParametrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
