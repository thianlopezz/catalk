import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    jQuery('.tooltipped').tooltip();
  }

  edit() {

    this.router.navigate(['/solicitudes', this.solicitud._id, 'edit']);
  }

}
