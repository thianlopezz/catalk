import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-list-tipo-admision',
  templateUrl: './list-tipo-admision.component.html',
  styleUrls: ['./list-tipo-admision.component.css']
})
export class ListTipoAdmisionComponent implements OnInit {

  @Input() admisiones = [];
  @Input() loading = false;

  @Output() detalle = new EventEmitter<any>();
  @Output() editar = new EventEmitter<any>();
  @Output() eliminar = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  onDetalle (admision) {

    this.detalle.next(admision);
  }

  onEditar(admision) {

    this.editar.next(admision);
  }

  onEliminar(admision) {

    this.eliminar.next(admision);
  }

}
