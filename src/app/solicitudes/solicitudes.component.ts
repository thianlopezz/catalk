import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SolicitudesService } from './solicitudes.service';

declare var jQuery: any;
declare var M: any;

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit, AfterViewInit {

  estado = 'lista';

  loadingSolicitudes;

  solicitudes = [];
  model: any = {};

  idSolicitud;

  mensajeConfirmacion;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private solicitudesService: SolicitudesService) {

    this.idSolicitud = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.idSolicitud) {
      this.estado = 'formulario';
    }
  }

  ngOnInit() {

    this.getSolicitudes();
  }

  ngAfterViewInit() {
    jQuery('.fixed-action-btn').floatingActionButton();
    jQuery('.modal').modal();
  }

  onSuccessForm() {

    this.estado = 'lista';
    this.getSolicitudes();
  }

  onCancelarForm() {

    this.estado = 'lista';
    this.model = {};
  }

  getSolicitudes() {

    this.loadingSolicitudes = true;

    this.solicitudesService.getSolicitudes()
      .subscribe(response => {

        if (response.success) {

          this.solicitudes = response.data;

          if (this.idSolicitud) {

            this.model = this.solicitudes.find(x => x._id === this.idSolicitud);

            setTimeout(() => {
              M.updateTextFields();
            }, 100);
          }
        } else {
          M.toast({ html: 'No se pudo cargar los modelos de solicitudes, inténtelo más tarde.' }, 1500);
          console.log(response.error);
        }

        this.loadingSolicitudes = false;
      },
        error => {
          M.toast({ html: 'No se pudo cargar los modelos de solicitudes, inténtelo más tarde.' }, 1500);
          console.log(error);
          this.loadingSolicitudes = false;
        });
  }

  onDetalle(solicitud) {

    this.router.navigate(['/solicitudes', solicitud._id]);
  }

  onEditar(solicitud) {

    this.estado = 'formulario';
    this.model = solicitud;
  }

  onEliminar(solicitud) {
    this.model = solicitud;
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

    this.solicitudesService.mantenimiento('D', this.model)
      .subscribe(result => {

        if (result.success) {

          M.toast({ html: 'Registro guardado.' }, 1500);
          this.getSolicitudes();
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
