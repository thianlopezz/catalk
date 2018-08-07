import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSolicitudesComponent } from './list-solicitudes.component';

describe('ListSolicitudesComponent', () => {
  let component: ListSolicitudesComponent;
  let fixture: ComponentFixture<ListSolicitudesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSolicitudesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
