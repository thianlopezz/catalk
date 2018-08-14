import { Component, OnInit, OnChanges, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { ParametrosService } from '../parametros.service';
import { NgForm } from '@angular/forms';

declare var jQuery: any;
declare var M: any;

@Component({
  selector: 'app-form-parametros',
  templateUrl: './form-parametros.component.html',
  styleUrls: ['./form-parametros.component.css']
})
export class FormParametrosComponent implements OnInit, AfterViewInit {

  @Input() model: any = {};

  @Output() success = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<any>();

  constructor(private parametrosService: ParametrosService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {

    setTimeout(() => {
      M.updateTextFields();
    }, 100);
  }

  guardar(f: NgForm) {

    if (!f.valid) {

      M.toast({ html: 'Existen errores en el formulario.' }, 1500);
      return;
    }

    const accion = 'U';

    this.parametrosService.mantenimiento(accion, this.model)
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
