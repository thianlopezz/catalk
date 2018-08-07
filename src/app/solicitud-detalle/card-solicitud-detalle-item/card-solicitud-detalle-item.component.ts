import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

declare var jQuery: any;
declare var M: any;

@Component({
  selector: 'app-card-solicitud-detalle-item',
  templateUrl: './card-solicitud-detalle-item.component.html',
  styleUrls: ['./card-solicitud-detalle-item.component.css']
})
export class CardSolicitudDetalleItemComponent implements OnInit, OnChanges {

  @Input() index: number;
  @Input() model;

  // BANDERA PARA DECIR QUE SOLO ES INFORMATIVO
  // NO SE PUEDE EDITAR
  @Input() esInfo = false;

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

    setTimeout(() => {
      M.updateTextFields();
    }, 100);
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
