import { Component, OnInit, OnChanges, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { TramitesService } from '../tramites.service';
import { NgForm } from '../../../../node_modules/@angular/forms';

declare var jQuery: any;
declare var M: any;

@Component({
  selector: 'app-form-tramites',
  templateUrl: './form-tramites.component.html',
  styleUrls: ['./form-tramites.component.css']
})
export class FormTramitesComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() model: any = {};

  @Output() success = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<any>();

  constructor(private tramitesService: TramitesService) { }

  ngOnInit() {
  }

  ngOnChanges() {

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

    let accion = 'I';

    if (this.model._id) {
      accion = 'U';
    }

    this.tramitesService.mantenimiento(accion, this.model)
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

