import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AdmisionesService } from '../admisiones.service';

import * as moment from 'moment';

declare var jQuery: any;
declare var M: any;

@Component({
  selector: 'app-form-admisiones',
  templateUrl: './form-admisiones.component.html',
  styleUrls: ['./form-admisiones.component.css']
})
export class FormAdmisionesComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() model: any = {};

  @Output() success = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<any>();

  constructor(private admisionesService: AdmisionesService) { }

  ngOnInit() {
  }

  ngOnChanges() {

    if (this.model.feInicio) {
      jQuery('#feInicio').val(moment(this.model.feInicio).format('DD[/]MM[/]YYYY'));
    }

    if (this.model.feInicio) {
      jQuery('#feFin').val(moment(this.model.feFin).format('DD[/]MM[/]YYYY'));
    }
  }

  ngAfterViewInit() {

    // jQuery('.tooltipped').tooltip().destroy();

    setTimeout(() => {
      M.updateTextFields();

      jQuery('.datepicker').datepicker({
        format: 'dd/mm/yyyy'
      });
    }, 100);
  }

  guardar(f: NgForm) {

    if (!f.valid) {

      M.toast({ html: 'Existen errores en el formulario.' }, 1500);
      return;
    }

    this.model.feInicio = moment(jQuery('#feInicio').val(), 'DD[/]MM[/]YYYY');
    this.model.feFin = moment(jQuery('#feFin').val(), 'DD[/]MM[/]YYYY');

    let accion = 'I';

    if (this.model._id) {
      accion = 'U';
    }

    this.admisionesService.mantenimiento(accion, this.model)
      .subscribe(result => {

        if (result.success) {

          M.toast({ html: 'Registro guardado.' }, 1500);
          this.success.next(result.data);
        } else {

          M.toast({ html: 'Ocurrió un error inténtelo más tarde.' }, 1500);
          console.log(result.error);
        }
      },
        error => {

          M.toast({ html: 'Ocurrió un error inténtelo más tarde.' }, 1500);
          console.log(error);
        });
  }

  _cancelar() {

    this.cancelar.next();
  }

}
