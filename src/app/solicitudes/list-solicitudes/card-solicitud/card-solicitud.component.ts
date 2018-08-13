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
      <div class="card-action center-align">
        <a [routerLink]="" class="tooltipped mx-3" data-position="bottom" data-tooltip="Detalles" (click)="_detalle()">
          <i class="material-icons">list_alt</i>
        </a>
        <a [routerLink]="" class="tooltipped mx-3" data-position="bottom" data-tooltip="Editar" (click)="_editar()">
          <i class="material-icons">edit</i>
        </a>
        <a [routerLink]="" class="red-text tooltipped mx-3"
            data-position="bottom" data-tooltip="Eliminar" (click)="_eliminar()">
          <i class="material-icons">delete</i>
        </a>
      </div>
    </div>`,
  styles: [`.card-content {
    height: 9rem;
  }
  .card-content>p{
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }`]
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
