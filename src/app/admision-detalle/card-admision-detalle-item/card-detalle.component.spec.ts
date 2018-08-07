import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAdmisionDetalleItemComponent } from './card-admision-detalle-item.component';

describe('CardAdmisionDetalleItemComponent', () => {
  let component: CardAdmisionDetalleItemComponent;
  let fixture: ComponentFixture<CardAdmisionDetalleItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardAdmisionDetalleItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardAdmisionDetalleItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
