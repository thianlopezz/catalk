import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SolicitudesService } from '../solicitudes/solicitudes.service';

declare var jQuery: any;
declare var M: any;

@Component({
  selector: 'app-solicitud-detalle',
  templateUrl: './solicitud-detalle.component.html',
  styleUrls: ['./solicitud-detalle.component.css']
})
export class SolicitudDetalleComponent implements OnInit, AfterViewInit {


  estado;
  loadingSolicitud;

  idSolicitud;
  solicitud: any = {};

  detalles: any;

  constructor(private activatedRoute: ActivatedRoute,
    private solicitudService: SolicitudesService) {

    this.idSolicitud = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getSolicitud();
  }

  ngAfterViewInit() {

    jQuery('.tabs').tabs();
  }

  addNuevoDetalle() {

    this.detalles.push({ accion: 'I', descripcion: '' });
  }

  onInsertarDetalle(detalle) {
    if (!this.solicitud.detalles) {
      this.solicitud.detalles = [];
    }

    this.solicitud.detalles.push(detalle.descripcion);
    this.guardarSolicitud();
  }

  onEditarDetalle(detalle) {

    const _detalle = Object.assign([], this.detalles);
    _detalle[detalle.index].accion = 'U';
    this.detalles = _detalle;
  }

  onModificarDetalle(detalle) {

    this.solicitud.detalles[detalle.index] = detalle.descripcion;
    this.guardarSolicitud();
  }

  onEliminarDetalle(detalle) {

    this.solicitud.detalles.splice(detalle.index, 1);
    this.guardarSolicitud();
  }

  onCancelarDetalle(detalle) {

    if (detalle.accion === 'I') {
      this.detalles.splice(detalle.index, 1);
    } else if (detalle.accion === 'U') {
      this.detalles[detalle.index] = { descripcion: this.detalles[detalle.index].descripcion };
    }
  }

  onArribaDetalle(detalle) {

    if (detalle.index === 0) {
      return;
    } else if (detalle.index > 0) {

      const elementoArriba = this.solicitud.detalles[detalle.index - 1];
      this.solicitud.detalles[detalle.index - 1] = detalle.descripcion;
      this.solicitud.detalles[detalle.index] = elementoArriba;
    }

    this.guardarSolicitud();
  }

  onAbajoDetalle(detalle) {

    if (detalle.index === this.detalles.length - 1) {
      return;
    } else if (detalle.index < this.detalles.length - 1) {

      const elementoAbajo = this.solicitud.detalles[detalle.index + 1];
      this.solicitud.detalles[detalle.index + 1] = detalle.descripcion;
      this.solicitud.detalles[detalle.index] = elementoAbajo;
    }

    this.guardarSolicitud();
  }

  guardarSolicitud() {

    this.solicitudService.mantenimiento('U', this.solicitud)
      .subscribe(result => {

        if (result.success) {

          M.toast({ html: 'Registro guardado.' }, 1500);
          this.getSolicitud();
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

  getSolicitud() {

    this.loadingSolicitud = true;

    this.solicitudService.getSolicitudById(this.idSolicitud)
      .subscribe(response => {

        if (response.success) {

          this.solicitud = response.data;
          this.setDetalles();
        } else {
          M.toast({ html: 'No se pudo cargar los datos, inténtelo más tarde.' }, 1500);
          console.log(response.error);
        }

        this.loadingSolicitud = false;
      },
        error => {
          M.toast({ html: 'No se pudo cargar los datos, inténtelo más tarde.' }, 1500);
          console.log(error);
          this.loadingSolicitud = false;
        });
  }

  setDetalles() {

    this.detalles = [];

    if (!this.solicitud.detalles) {
      return;
    }

    this.solicitud.detalles.forEach(detalle => {
      this.detalles.push({ descripcion: detalle });
    });
  }

}
