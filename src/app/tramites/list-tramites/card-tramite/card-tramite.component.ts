import { Component, OnInit, AfterViewInit, Output, Input, EventEmitter } from '@angular/core';

declare var jQuery: any;

@Component({
  selector: 'app-card-tramite',
  template:
    `<div *ngIf="tramite" class="card hoverable">
      <div class="card-content">
        <span class="card-title">{{tramite.tramite}}</span>
        <p>{{tramite.descripcion}}</p>
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
export class CardTramiteComponent implements OnInit, AfterViewInit {

  @Input() tramite;

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

    this.detalle.next(this.tramite);
  }

  _editar() {

    this.editar.next(this.tramite);
  }

  _eliminar() {

    this.eliminar.next(this.tramite);
  }

}
