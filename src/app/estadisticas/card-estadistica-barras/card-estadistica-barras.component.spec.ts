import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEstadisticaBarrasComponent } from './card-estadistica-barras.component';

describe('CardEstadisticaBarrasComponent', () => {
  let component: CardEstadisticaBarrasComponent;
  let fixture: ComponentFixture<CardEstadisticaBarrasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardEstadisticaBarrasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardEstadisticaBarrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
