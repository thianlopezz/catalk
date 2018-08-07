import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-confirma',
  templateUrl: './modal-confirma.component.html',
  styleUrls: ['./modal-confirma.component.css']
})
export class ModalConfirmaComponent implements OnInit {

  @Input() mensajeConfirmacion = '';

  @Output() confirmar = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  _confirmar() {
    this.confirmar.next();
  }

  _cancelar() {
    this.cancelar.next();
  }

}
