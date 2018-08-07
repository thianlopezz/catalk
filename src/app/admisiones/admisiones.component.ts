import { Component, OnInit, AfterViewInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { AdmisionesService } from './admisiones.service';
import { Router, ActivatedRoute } from '@angular/router';

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

  idAdmision;

  mensajeConfirmacion;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private admisionesService: AdmisionesService) {

    this.idAdmision = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.idAdmision) {
      this.estado = 'formulario';
    }
  }

  ngOnInit() {

    this.getAdmisiones();
  }

  ngAfterViewInit() {
    jQuery('.fixed-action-btn').floatingActionButton();
    jQuery('.modal').modal();
  }

  onSuccessForm() {

    this.estado = 'lista';
    this.getAdmisiones();
  }

  onCancelarForm() {

    this.estado = 'lista';
    this.model = {};
  }

  getAdmisiones() {

    this.loadingAdmisiones = true;

    this.admisionesService.getAdmisiones()
      .subscribe(response => {

        if (response.success) {

          this.admisiones = response.data;

          if (this.idAdmision) {

            this.model = this.admisiones.find(x => x._id === this.idAdmision);

            setTimeout(() => {
              M.updateTextFields();
            }, 100);
          }
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
    this.model = admision;
    this.mensajeConfirmacion = '¿Está seguro de eliminar el registro?';
    jQuery('#modalConfirma').modal('open');
  }

  onConfirmarModal() {
    this.delete();
  }

  onCancelarModal() {
    this.model = {};
    jQuery('#modalConfirma').modal('close');
  }

  delete() {

    this.admisionesService.mantenimiento('D', this.model)
      .subscribe(result => {

        if (result.success) {

          M.toast({ html: 'Registro eliminado.' }, 1500);
          this.getAdmisiones();
        } else {

          M.toast({ html: 'Ocurrió un error inténtelo más tarde.' }, 1500);
          console.log(result.error);
        }

        jQuery('#modalConfirma').modal('close');
      },
        error => {

          M.toast({ html: 'Ocurrió un error inténtelo más tarde.' }, 1500);
          console.log(error);
          jQuery('#modalConfirma').modal('close');
        });
  }

}
