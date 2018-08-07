import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTramiteDetalleComponent } from './card-tramite-detalle.component';

describe('CardTramiteDetalleComponent', () => {
  let component: CardTramiteDetalleComponent;
  let fixture: ComponentFixture<CardTramiteDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardTramiteDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardTramiteDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
