import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

declare var jQuery: any;

@Component({
  selector: 'app-card-admision-detalle',
  templateUrl: './card-admision-detalle.component.html',
  styleUrls: ['./card-admision-detalle.component.css']
})
export class CardAdmisionDetalleComponent implements OnInit, AfterViewInit {

  @Input() admision: any = {};
  @Input() loading;

  @Input() botonera = false;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    jQuery('.tooltipped').tooltip();
  }

  edit() {

  }


}
