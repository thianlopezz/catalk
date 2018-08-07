import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

declare var jQuery: any;

@Component({
  selector: 'app-card-solicitud-detalle',
  templateUrl: './card-solicitud-detalle.component.html',
  styleUrls: ['./card-solicitud-detalle.component.css']
})
export class CardSolicitudDetalleComponent implements OnInit, AfterViewInit {

  @Input() solicitud: any = {};
  @Input() loading;

  @Input() botonera = false;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    jQuery('.tooltipped').tooltip();
  }

}
