import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '../../../node_modules/@angular/router';
import { TramitesService } from '../tramites/tramites.service';
import { SolicitudesService } from '../solicitudes/solicitudes.service';

declare var jQuery: any;
declare var M: any;

@Component({
  selector: 'app-tramite-detalle',
  templateUrl: './tramite-detalle.component.html',
  styleUrls: ['./tramite-detalle.component.css']
})
export class TramiteDetalleComponent implements OnInit, AfterViewInit {


  estado;
  loadingTramite;

  idTramite;
  tramite: any = {};

  detalles: any;
  requisitos: any;

  solicitudes = [];

  constructor(private activatedRoute: ActivatedRoute,
    private tramitesService: TramitesService,
    private solicitudesService: SolicitudesService) {

    this.idTramite = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getTramites();
    this.getSolicitudes();
  }

  ngAfterViewInit() {

    jQuery('.tabs').tabs();
    jQuery('.dropdown-trigger').dropdown();
  }

  getSolicitudes() {

    this.solicitudesService.getSolicitudes()
      .subscribe(response => {

        if (response.success) {
          this.solicitudes = response.data;
        } else {
          M.toast({ html: 'No se pudo cargar los modelos de solicitudes, inténtelo más tarde.' }, 1500);
          console.log(response.error);
        }
      },
        error => {
          M.toast({ html: 'No se pudo cargar los modelos de solicitudes, inténtelo más tarde.' }, 1500);
          console.log(error);
        });
  }

  addNuevoDetalle(modoDetalle) {

    this.detalles.push({ accion: 'I', descripcion: '', modo: modoDetalle });
  }

  addNuevoRequisito(modoDetalle) {

    this.requisitos.push({ accion: 'I', descripcion: '', modo: modoDetalle });
  }

  onInsertarDetalle(detalle) {

    if (!this.tramite.detalles) {
      this.tramite.detalles = [];
    }

    this.tramite.detalles.push(detalle);
    this.guardarTramite();
  }

  onInsertarRequisito(requisito) {

    if (!this.tramite.requisitos) {
      this.tramite.requisitos = [];
    }

    this.tramite.requisitos.push(requisito);
    this.guardarTramite();
  }

  onEditarDetalle(detalle) {

    let modo;

    if (!detalle.idSolicitud && !detalle.link) {
      modo = 'DESCRIPCION';
    } else if (detalle.idSolicitud) {
      modo = 'MODELO';
    } else if (detalle.link) {
      modo = 'LINK';
    }

    const _detalle = Object.assign([], this.detalles);
    _detalle[detalle.index].accion = 'U';
    _detalle[detalle.index].modo = modo;
    this.detalles = _detalle;
  }

  onEditarRequisito(requisito) {

    let modo;

    if (!requisito.idSolicitud && !requisito.link) {
      modo = 'DESCRIPCION';
    } else if (requisito.idSolicitud) {
      modo = 'MODELO';
    } else if (requisito.link) {
      modo = 'LINK';
    }

    const _requisito = Object.assign([], this.requisitos);
    _requisito[requisito.index].accion = 'U';
    _requisito[requisito.index].modo = modo;
    this.requisitos = _requisito;
  }

  onModificarDetalle(detalle) {

    this.tramite.detalles[detalle.index] = detalle;
    this.guardarTramite();
  }

  onModificarRequisito(requisito) {

    this.tramite.requisitos[requisito.index] = requisito;
    this.guardarTramite();
  }

  onEliminarRequisito(requisito) {

    this.tramite.requisitos.splice(requisito.index, 1);
    this.guardarTramite();
  }

  onEliminarDetalle(detalle) {

    this.tramite.detalles.splice(detalle.index, 1);
    this.guardarTramite();
  }

  onCancelarDetalle(detalle) {

    if (detalle.accion === 'I') {
      this.detalles.splice(detalle.index, 1);
    } else if (detalle.accion === 'U') {
      // this.detalles[detalle.index] = { descripcion: this.detalles[detalle.index].descripcion };
      this.detalles[detalle.index].accion = undefined;
      this.detalles[detalle.index] = this.detalles[detalle.index];
    }
  }

  onCancelarRequisito(requisito) {

    if (requisito.accion === 'I') {
      this.requisitos.splice(requisito.index, 1);
    } else if (requisito.accion === 'U') {
      // this.requisitos[requisito.index] = { descripcion: this.requisitos[requisito.index].descripcion };
      this.requisitos[requisito.index].accion = undefined;
      this.requisitos[requisito.index] = this.requisitos[requisito.index];
    }
  }

  onArribaDetalle(detalle) {

    if (detalle.index === 0) {
      return;
    } else if (detalle.index > 0) {

      const elementoArriba = this.tramite.detalles[detalle.index - 1];
      this.tramite.detalles[detalle.index - 1] = detalle;
      this.tramite.detalles[detalle.index] = elementoArriba;
    }

    this.guardarTramite();
  }

  onArribaRequisito(requisito) {

    if (requisito.index === 0) {
      return;
    } else if (requisito.index > 0) {

      const elementoArriba = this.tramite.requisitos[requisito.index - 1];
      this.tramite.requisitos[requisito.index - 1] = requisito;
      this.tramite.requisitos[requisito.index] = elementoArriba;
    }

    this.guardarTramite();
  }

  onAbajoDetalle(detalle) {

    if (detalle.index === this.detalles.length - 1) {
      return;
    } else if (detalle.index < this.detalles.length - 1) {

      const elementoAbajo = this.tramite.detalles[detalle.index + 1];
      this.tramite.detalles[detalle.index + 1] = detalle;
      this.tramite.detalles[detalle.index] = elementoAbajo;
    }

    this.guardarTramite();
  }

  onAbajoRequisito(requisito) {

    if (requisito.index === this.requisitos.length - 1) {
      return;
    } else if (requisito.index < this.requisitos.length - 1) {

      const elementoAbajo = this.tramite.requisitos[requisito.index + 1];
      this.tramite.requisitos[requisito.index + 1] = requisito;
      this.tramite.requisitos[requisito.index] = elementoAbajo;
    }

    this.guardarTramite();
  }

  guardarTramite() {

    this.tramitesService.mantenimiento('U', this.tramite)
      .subscribe(result => {

        if (result.success) {

          M.toast({ html: 'Registro guardado.' }, 1500);
          this.getTramites();
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

  getTramites() {

    this.loadingTramite = true;

    this.tramitesService.getTramiteById(this.idTramite)
      .subscribe(response => {

        if (response.success) {

          this.tramite = response.data;
          this.setRequisitos();
          this.setDetalles();
        } else {
          M.toast({ html: 'No se pudo cargar los datos, inténtelo más tarde.' }, 1500);
          console.log(response.error);
        }

        this.loadingTramite = false;
      },
        error => {
          M.toast({ html: 'No se pudo cargar los datos, inténtelo más tarde.' }, 1500);
          console.log(error);
          this.loadingTramite = false;
        });
  }

  setDetalles() {

    this.detalles = [];

    if (!this.tramite.detalles) {
      return;
    }

    this.tramite.detalles.forEach(detalle => {
      this.detalles.push(detalle);
    });
  }

  setRequisitos() {

    this.requisitos = [];

    if (!this.tramite.requisitos) {
      return;
    }

    this.tramite.requisitos.forEach(requisito => {
      this.requisitos.push(requisito);
    });
  }

}

