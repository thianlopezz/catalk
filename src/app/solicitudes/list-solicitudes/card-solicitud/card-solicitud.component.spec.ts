import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSolicitudComponent } from './card-solicitud.component';

describe('CardSolicitudComponent', () => {
  let component: CardSolicitudComponent;
  let fixture: ComponentFixture<CardSolicitudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardSolicitudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
