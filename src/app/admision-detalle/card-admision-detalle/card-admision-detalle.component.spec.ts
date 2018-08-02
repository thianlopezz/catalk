import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAdmisionDetalleComponent } from './card-admision-detalle.component';

describe('CardAdmisionDetalleComponent', () => {
  let component: CardAdmisionDetalleComponent;
  let fixture: ComponentFixture<CardAdmisionDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardAdmisionDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardAdmisionDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
