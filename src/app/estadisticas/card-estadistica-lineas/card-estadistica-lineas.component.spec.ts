import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEstadisticaLineasComponent } from './card-estadistica-lineas.component';

describe('CardEstadisticaLineasComponent', () => {
  let component: CardEstadisticaLineasComponent;
  let fixture: ComponentFixture<CardEstadisticaLineasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardEstadisticaLineasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardEstadisticaLineasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
