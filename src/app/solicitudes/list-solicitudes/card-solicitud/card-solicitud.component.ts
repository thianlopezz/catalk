import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';

declare var jQuery: any;

@Component({
  selector: 'app-card-solicitud',
  template:
    `<div *ngIf="solicitud" class="card hoverable">
      <div class="card-content">
        <span class="card-title">{{solicitud.solicitud}}</span>
        <p>{{solicitud.descripcion}}</p>
      </div>
      <div class="card-action">
        <a href="javascript:;" class="btn tooltipped mx-1" data-position="bottom" data-tooltip="Detalles" (click)="_detalle()">
          <i class="material-icons">list_alt</i>
        </a>
        <a href="javascript:;" class="btn tooltipped mx-1" data-position="bottom" data-tooltip="Editar" (click)="_editar()">
          <i class="material-icons">edit</i>
        </a>
        <a href="javascript:;" class="btn btn-flat red-text tooltipped mx-1"
            data-position="bottom" data-tooltip="Eliminar" (click)="_eliminar()">
          <i class="material-icons">delete</i>
        </a>
      </div>
    </div>`,
  styles: [``]
})
export class CardSolicitudComponent implements OnInit, AfterViewInit {

  @Input() solicitud;

  @Output() detalle = new EventEmitter<any>();
  @Output() editar = new EventEmitter<any>();
  @Output() eliminar = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    jQuery('.tooltipped').tooltip();
  }

  _detalle() {

    this.detalle.next(this.solicitud);
  }

  _editar() {

    this.editar.next(this.solicitud);
  }

  _eliminar() {

    this.eliminar.next(this.solicitud);
  }

}
