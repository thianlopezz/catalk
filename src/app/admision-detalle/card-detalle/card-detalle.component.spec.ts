import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDetalleComponent } from './card-detalle.component';

describe('CardDetalleComponent', () => {
  let component: CardDetalleComponent;
  let fixture: ComponentFixture<CardDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
