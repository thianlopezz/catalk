import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudDetalleExComponent } from './solicitud-detalle-ex.component';

describe('SolicitudDetalleExComponent', () => {
  let component: SolicitudDetalleExComponent;
  let fixture: ComponentFixture<SolicitudDetalleExComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudDetalleExComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudDetalleExComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
