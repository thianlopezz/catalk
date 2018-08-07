import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTramitesComponent } from './list-tramites.component';

describe('ListTramitesComponent', () => {
  let component: ListTramitesComponent;
  let fixture: ComponentFixture<ListTramitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTramitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTramitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
