import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSolicitudDetalleItemComponent } from './card-solicitud-detalle-item.component';

describe('CardSolicitudDetalleItemComponent', () => {
  let component: CardSolicitudDetalleItemComponent;
  let fixture: ComponentFixture<CardSolicitudDetalleItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardSolicitudDetalleItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardSolicitudDetalleItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
