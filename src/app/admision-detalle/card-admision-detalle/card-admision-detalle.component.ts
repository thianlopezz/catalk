import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card-admision-detalle',
  templateUrl: './card-admision-detalle.component.html',
  styleUrls: ['./card-admision-detalle.component.css']
})
export class CardAdmisionDetalleComponent implements OnInit {

  @Input() admision: any = {};
  @Input() loading = {};

  constructor() { }

  ngOnInit() {
  }

}
