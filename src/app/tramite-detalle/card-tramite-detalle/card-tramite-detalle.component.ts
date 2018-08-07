import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

declare var jQuery: any;

@Component({
  selector: 'app-card-tramite-detalle',
  templateUrl: './card-tramite-detalle.component.html',
  styleUrls: ['./card-tramite-detalle.component.css']
})
export class CardTramiteDetalleComponent implements OnInit, AfterViewInit {

  @Input() tramite: any = {};
  @Input() loading;

  @Input() botonera = false;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    jQuery('.tooltipped').tooltip();
  }

}
