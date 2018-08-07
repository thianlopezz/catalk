import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

declare var jQuery: any;
declare var M: any;

@Component({
  selector: 'app-card-tramite-detalle-item',
  templateUrl: './card-tramite-detalle-item.component.html',
  styleUrls: ['./card-tramite-detalle-item.component.css']
})
export class CardTramiteDetalleItemComponent implements OnInit, OnChanges {

  @Input() index: number;
  @Input() model;
  @Input() solicitudes = [];
  @Input() requisito = false;

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

  // PARA SABER SI ES REQUISITO O DETALLE
  modo;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {

    if (this.requisito) {
      this.modo = 'REQ';
    } else {
      this.modo = 'DET';
    }

    setTimeout(() => {
      M.updateTextFields();
      jQuery('select').formSelect();
      this.setSelect();
    }, 100);
  }

  setSelect() {

    if (this.model.idSolicitud) {
      jQuery('#select_' + this.modo + this.index).val(this.model.idSolicitud);
    }
  }

  _insertarModificar() {

    if (!this.model.descripcion || this.model.descripcion.trim() === '') {
      M.toast({ html: 'Ingresa una descripción válida.' }, 1500);
      return;
    }

    let model;

    if (this.model.modo === 'DESCRIPCION') {
      model = { index: this.index, descripcion: this.model.descripcion };
    } else if (this.model.modo === 'MODELO') {

      const idSolicitud = jQuery('#select_' + this.modo + this.index).val();

      if (!idSolicitud || idSolicitud === '') {
        M.toast({ html: 'Elije un modelo de solicitud.' }, 1500);
        return;
      }

      model = { index: this.index, descripcion: this.model.descripcion, idSolicitud };
    } else if (this.model.modo === 'LINK') {

      if (!this.model.link || this.model.link.trim() === '') {
        M.toast({ html: 'Ingresa una url válida.' }, 1500);
        return;
      }

      if (this.model.link.toLowerCase().indexOf('https://') === -1
        && this.model.link.toLowerCase().indexOf('http://') === -1) {
        M.toast({ html: 'Las url deben contener https:// o http:// al inicio.' }, 1500);
        return;
      }

      model = { index: this.index, descripcion: this.model.descripcion, link: this.model.link };
    }

    if (this.model.accion === 'I') {
      this.insertar.next(model);
    } else if (this.model.accion === 'U') {
      this.modificar.next(model);
    }
  }

  _editar() {

    this.model.index = this.index;
    this.editar.next(this.model);

    setTimeout(() => {
      M.updateTextFields();
    }, 100);
  }

  _cancelar() {

    this.model.index = this.index;
    this.cancelar.next(this.model);
  }

  _arriba() {

    this.model.index = this.index;
    this.arriba.next(this.model);
  }

  _abajo() {

    this.model.index = this.index;
    this.abajo.next(this.model);
  }

  _eliminar() {

    this.model.index = this.index;
    this.eliminar.next(this.model);
  }

}
