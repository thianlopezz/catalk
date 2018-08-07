import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TramiteDetalleExComponent } from './tramite-detalle-ex.component';

describe('TramiteDetalleExComponent', () => {
  let component: TramiteDetalleExComponent;
  let fixture: ComponentFixture<TramiteDetalleExComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TramiteDetalleExComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TramiteDetalleExComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
