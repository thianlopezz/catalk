import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTipoAdmisionComponent } from './card-tipo-admision.component';

describe('CardTipoAdmisionComponent', () => {
  let component: CardTipoAdmisionComponent;
  let fixture: ComponentFixture<CardTipoAdmisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardTipoAdmisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardTipoAdmisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
