import { Component, OnInit, Input, Output, OnChanges, AfterViewInit, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SolicitudesService } from '../solicitudes.service';

import * as moment from 'moment';

declare var jQuery: any;
declare var M: any;

@Component({
  selector: 'app-form-solicitudes',
  templateUrl: './form-solicitudes.component.html',
  styleUrls: ['./form-solicitudes.component.css']
})
export class FormSolicitudesComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() model: any = {};

  @Output() success = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<any>();

  constructor(private solicitudesService: SolicitudesService) { }

  ngOnInit() {
  }

  ngOnChanges() {

    if (this.model.archivo) {
      jQuery('#_archivo').val(this.model.archivo);
    }
  }

  ngAfterViewInit() {

    // jQuery('.tooltipped').tooltip().destroy();

    setTimeout(() => {
      M.updateTextFields();
    }, 100);
  }

  guardar(f: NgForm) {

    if (!f.valid) {

      M.toast({ html: 'Existen errores en el formulario.' }, 1500);
      return;
    }

    const archivo = jQuery('#archivo').prop('files')[0];

    if (!archivo && !this.model.archivo) {

      M.toast({ html: 'Debes subir un archivo de modelo de solicitud.' }, 1500);
      return;
    }

    this.model.archivo = archivo || this.model.archivo;

    let accion = 'I';

    if (this.model._id) {
      accion = 'U';
    }

    this.solicitudesService.mantenimiento(accion, this.model)
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
