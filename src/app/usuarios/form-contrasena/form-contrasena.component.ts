import { Component, OnInit, OnChanges, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { UsuariosService } from '../usuarios.service';
import { NgForm } from '../../../../node_modules/@angular/forms';

declare var jQuery: any;
declare var M: any;

@Component({
  selector: 'app-form-contrasena',
  templateUrl: './form-contrasena.component.html',
  styleUrls: ['./form-contrasena.component.css']
})
export class FormContrasenaComponent implements OnInit, OnChanges, AfterViewInit {

  @Output() success = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<any>();

  model: any = {};

  constructor(private usuariosService: UsuariosService) { }

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

    if (this.model.contrasena !== this.model.contrasena_r) {

      M.toast({ html: 'Las nuevas contraseñas no coinciden.' }, 1500);
      return;
    }

    if (this.model.contrasena.length < 6) {

      M.toast({ html: 'La nueva contraseña debe tener al menos 6 caracteres.' }, 1500);
      return;
    }

    this.usuariosService.cambiaContrasena(this.model)
      .subscribe(result => {

        if (result.success) {

          M.toast({ html: 'Contraseña actualizada.' }, 1500);
          this.success.next();
        } else {

          M.toast({ html: result.mensaje }, 1500);
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
