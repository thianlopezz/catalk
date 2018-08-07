import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTramitesComponent } from './form-tramites.component';

describe('FormTramitesComponent', () => {
  let component: FormTramitesComponent;
  let fixture: ComponentFixture<FormTramitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormTramitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTramitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
