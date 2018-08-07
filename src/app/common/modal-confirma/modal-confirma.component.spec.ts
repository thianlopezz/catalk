import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmaComponent } from './modal-confirma.component';

describe('ModalConfirmaComponent', () => {
  let component: ModalConfirmaComponent;
  let fixture: ComponentFixture<ModalConfirmaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalConfirmaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
