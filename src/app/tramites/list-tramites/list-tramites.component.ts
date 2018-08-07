import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-list-tramites',
  templateUrl: './list-tramites.component.html',
  styleUrls: ['./list-tramites.component.css']
})
export class ListTramitesComponent implements OnInit {

  @Input() tramites = [];
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
