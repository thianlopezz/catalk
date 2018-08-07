import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSolicitudDetalleComponent } from './card-solicitud-detalle.component';

describe('CardSolicitudDetalleComponent', () => {
  let component: CardSolicitudDetalleComponent;
  let fixture: ComponentFixture<CardSolicitudDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardSolicitudDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardSolicitudDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
