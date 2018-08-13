import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-list-usuarios',
  templateUrl: './list-usuarios.component.html',
  styleUrls: ['./list-usuarios.component.css']
})
export class ListUsuariosComponent implements OnInit {

  @Input() usuarios = [];
  @Input() loading = false;

  @Output() detalle = new EventEmitter<any>();
  @Output() editar = new EventEmitter<any>();
  @Output() eliminar = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  onDetalle(tramite) {

    this.detalle.next(tramite);
  }

  onEditar(tramite) {

    this.editar.next(tramite);
  }

  onEliminar(tramite) {

    this.eliminar.next(tramite);
  }

}
