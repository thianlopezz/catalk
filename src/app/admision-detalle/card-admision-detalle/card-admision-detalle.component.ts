import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    jQuery('.tooltipped').tooltip();
  }

  edit() {

    this.router.navigate(['admisiones', this.admision._id, 'edit']);
  }


}
