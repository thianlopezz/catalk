import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    jQuery('.tooltipped').tooltip();
  }

  edit() {

    this.router.navigate(['/tramites', this.tramite._id, 'edit']);
  }
}
