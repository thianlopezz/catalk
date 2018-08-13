import { Component, OnInit } from '@angular/core';
import { Router } from '../../../node_modules/@angular/router';
import { ParametrosService } from './parametros.service';

declare var jQuery: any;
declare var M: any;

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.css']
})
export class ParametrosComponent implements OnInit {

  loadingParametros;

  model: any = {};

  mensajeConfirmacion;

  constructor(private router: Router,
    private parametrosService: ParametrosService) {
  }

  ngOnInit() {
    this.getParametros();
  }

  onSuccessForm() {

    this.getParametros();
  }

  onCancelarForm() {

    this.router.navigate(['/ds']);
  }

  getParametros() {

    this.loadingParametros = true;

    this.parametrosService.getParametros()
      .subscribe(response => {

        if (response.success) {

          this.model = response.data;

          setTimeout(() => {
            M.updateTextFields();
          }, 100);

        } else {
          M.toast({ html: 'No se pudo cargar los parámetros, inténtelo más tarde.' }, 1500);
          console.log(response.error);
        }

        this.loadingParametros = false;
      },
        error => {
          M.toast({ html: 'No se pudo cargar las parámetros, inténtelo más tarde.' }, 1500);
          console.log(error);
          this.loadingParametros = false;
        });
  }

}
