import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudDetalleComponent } from './solicitud-detalle.component';

describe('SolicitudDetalleComponent', () => {
  let component: SolicitudDetalleComponent;
  let fixture: ComponentFixture<SolicitudDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
