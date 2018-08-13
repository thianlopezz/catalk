import { Component, OnInit, OnChanges, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { UsuariosService } from '../../usuarios/usuarios.service';
import { NgForm } from '../../../../node_modules/@angular/forms';

declare var jQuery: any;
declare var M: any;

@Component({
  selector: 'app-olvide-contrasena',
  templateUrl: './olvide-contrasena.component.html',
  styleUrls: ['./olvide-contrasena.component.css']
})
export class OlvideContrasenaComponent implements OnInit, OnChanges, AfterViewInit {

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

    this.usuariosService.olvideContrasena(this.model)
      .subscribe(result => {

        if (result.success) {

          M.toast({ html: 'Hemos enviado las instrucciones para recuperar la contraseña a tu correo.' }, 2500);
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
