import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipoAdmisionComponent } from './list-tipo-admision.component';

describe('ListTipoAdmisionComponent', () => {
  let component: ListTipoAdmisionComponent;
  let fixture: ComponentFixture<ListTipoAdmisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTipoAdmisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipoAdmisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
