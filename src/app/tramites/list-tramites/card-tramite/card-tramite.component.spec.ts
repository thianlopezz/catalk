import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTramiteComponent } from './card-tramite.component';

describe('CardTramiteComponent', () => {
  let component: CardTramiteComponent;
  let fixture: ComponentFixture<CardTramiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardTramiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardTramiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
