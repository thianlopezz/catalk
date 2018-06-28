import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmisionDetalleComponent } from './admision-detalle.component';

describe('AdmisionDetalleComponent', () => {
  let component: AdmisionDetalleComponent;
  let fixture: ComponentFixture<AdmisionDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmisionDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmisionDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
