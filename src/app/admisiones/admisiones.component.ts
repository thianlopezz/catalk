import { Component, OnInit, AfterViewInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { AdmisionesService } from './admisiones.service';
import { Router } from '@angular/router';

declare var jQuery: any;
declare var M: any;

@Component({
  selector: 'app-admisiones',
  templateUrl: './admisiones.component.html',
  styleUrls: ['./admisiones.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 }))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(500, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AdmisionesComponent implements OnInit, AfterViewInit {

  estado = 'lista';

  loadingAdmisiones;

  admisiones = [];
  model: any = {};

  constructor(private router: Router,
    private admisionesService: AdmisionesService) { }

  ngOnInit() {

    this.getAdmisiones();
  }

  ngAfterViewInit() {
    jQuery('.fixed-action-btn').floatingActionButton();
  }

  onSuccessForm() {

    this.estado = 'lista';
    this.getAdmisiones();
  }

  onCancelarForm() {

    this.estado = 'lista';
  }

  getAdmisiones() {

    this.loadingAdmisiones = true;

    this.admisionesService.getAdmisiones()
      .subscribe(response => {

        if (response.success) {
          this.admisiones = response.data;
        } else {
          M.toast({ html: 'No se pudo cargar las admisiones, inténtelo más tarde.' }, 1500);
          console.log(response.error);
        }

        this.loadingAdmisiones = false;
      },
        error => {
          M.toast({ html: 'No se pudo cargar las admisiones, inténtelo más tarde.' }, 1500);
          console.log(error);
          this.loadingAdmisiones = false;
        });
  }

  onDetalle(admision) {

    this.router.navigate(['/admisiones', admision._id]);
  }

  onEditar(admision) {

    this.estado = 'formulario';
    this.model = admision;
  }

  onEliminar(admision) {

  }

}
