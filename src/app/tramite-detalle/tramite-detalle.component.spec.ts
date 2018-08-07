import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TramiteDetalleComponent } from './tramite-detalle.component';

describe('TramiteDetalleComponent', () => {
  let component: TramiteDetalleComponent;
  let fixture: ComponentFixture<TramiteDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TramiteDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TramiteDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
