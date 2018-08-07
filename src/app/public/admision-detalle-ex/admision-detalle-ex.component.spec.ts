import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmisionDetalleExComponent } from './admision-detalle-ex.component';

describe('AdmisionDetalleExComponent', () => {
  let component: AdmisionDetalleExComponent;
  let fixture: ComponentFixture<AdmisionDetalleExComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmisionDetalleExComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmisionDetalleExComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
