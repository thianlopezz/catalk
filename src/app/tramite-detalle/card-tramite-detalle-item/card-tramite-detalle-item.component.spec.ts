import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTramiteDetalleItemComponent } from './card-tramite-detalle-item.component';

describe('CardTramiteDetalleItemComponent', () => {
  let component: CardTramiteDetalleItemComponent;
  let fixture: ComponentFixture<CardTramiteDetalleItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardTramiteDetalleItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardTramiteDetalleItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
