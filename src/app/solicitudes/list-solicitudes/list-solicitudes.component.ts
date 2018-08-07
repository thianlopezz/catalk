import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-list-solicitudes',
  templateUrl: './list-solicitudes.component.html',
  styleUrls: ['./list-solicitudes.component.css']
})
export class ListSolicitudesComponent implements OnInit {

  @Input() solicitudes = [];
  @Input() loading = false;

  @Output() detalle = new EventEmitter<any>();
  @Output() editar = new EventEmitter<any>();
  @Output() eliminar = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  onDetalle(solicitud) {

    this.detalle.next(solicitud);
  }

  onEditar(solicitud) {

    this.editar.next(solicitud);
  }

  onEliminar(solicitud) {

    this.eliminar.next(solicitud);
  }

}
