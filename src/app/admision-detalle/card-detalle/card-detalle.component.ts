import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

declare var jQuery: any;
declare var M: any;

@Component({
  selector: 'app-card-detalle',
  templateUrl: './card-detalle.component.html',
  styleUrls: ['./card-detalle.component.css']
})
export class CardDetalleComponent implements OnInit, OnChanges {

  @Input() index: number;
  @Input() model;

  @Output() insertar = new EventEmitter<any>();
  @Output() modificar = new EventEmitter<any>();
  @Output() editar = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<any>();

  @Output() arriba = new EventEmitter<any>();
  @Output() abajo = new EventEmitter<any>();
  @Output() eliminar = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    setTimeout(() => {
      M.updateTextFields();
    }, 100);
  }

  _insertarModificar() {

    if (this.model.accion === 'I') {
      this.insertar.next({ index: this.index, descripcion: this.model.descripcion });
    } else if (this.model.accion === 'U') {
      this.modificar.next({ index: this.index, descripcion: this.model.descripcion });
    }
  }

  _editar() {

    this.editar.next({ index: this.index, descripcion: this.model.descripcion });
  }

  _cancelar() {

    this.cancelar.next({ index: this.index, accion: this.model.accion, descripcion: this.model.descripcion });
  }

  _arriba() {

    this.arriba.next({ index: this.index, descripcion: this.model.descripcion });
  }

  _abajo() {

    this.abajo.next({ index: this.index, descripcion: this.model.descripcion });
  }

  _eliminar() {

    this.eliminar.next({ index: this.index, descripcion: this.model.descripcion });
  }

}
