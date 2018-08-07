import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdmisionesService } from '../admisiones/admisiones.service';
import { SolicitudesService } from '../solicitudes/solicitudes.service';

declare var jQuery: any;
declare var M: any;

@Component({
  selector: 'app-admision-detalle',
  templateUrl: './admision-detalle.component.html',
  styleUrls: ['./admision-detalle.component.css']
})
export class AdmisionDetalleComponent implements OnInit, AfterViewInit {


  estado;
  loadingAdmision;

  idAdmision;
  admision: any = {};

  detalles: any;
  requisitos: any;

  solicitudes = [];

  constructor(private activatedRoute: ActivatedRoute,
    private admisionesService: AdmisionesService,
    private solicitudesService: SolicitudesService) {

    this.idAdmision = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getAdmisiones();
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

    if (!this.admision.detalles) {
      this.admision.detalles = [];
    }

    this.admision.detalles.push(detalle);
    this.guardarAdmision();
  }

  onInsertarRequisito(requisito) {

    if (!this.admision.requisitos) {
      this.admision.requisitos = [];
    }

    this.admision.requisitos.push(requisito);
    this.guardarAdmision();
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

    this.admision.detalles[detalle.index] = detalle;
    this.guardarAdmision();
  }

  onModificarRequisito(requisito) {

    this.admision.requisitos[requisito.index] = requisito;
    this.guardarAdmision();
  }

  onEliminarRequisito(requisito) {

    this.admision.requisitos.splice(requisito.index, 1);
    this.guardarAdmision();
  }

  onEliminarDetalle(detalle) {

    this.admision.detalles.splice(detalle.index, 1);
    this.guardarAdmision();
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

      const elementoArriba = this.admision.detalles[detalle.index - 1];
      this.admision.detalles[detalle.index - 1] = detalle;
      this.admision.detalles[detalle.index] = elementoArriba;
    }

    this.guardarAdmision();
  }

  onArribaRequisito(requisito) {

    if (requisito.index === 0) {
      return;
    } else if (requisito.index > 0) {

      const elementoArriba = this.admision.requisitos[requisito.index - 1];
      this.admision.requisitos[requisito.index - 1] = requisito;
      this.admision.requisitos[requisito.index] = elementoArriba;
    }

    this.guardarAdmision();
  }

  onAbajoDetalle(detalle) {

    if (detalle.index === this.detalles.length - 1) {
      return;
    } else if (detalle.index < this.detalles.length - 1) {

      const elementoAbajo = this.admision.detalles[detalle.index + 1];
      this.admision.detalles[detalle.index + 1] = detalle;
      this.admision.detalles[detalle.index] = elementoAbajo;
    }

    this.guardarAdmision();
  }

  onAbajoRequisito(requisito) {

    if (requisito.index === this.requisitos.length - 1) {
      return;
    } else if (requisito.index < this.requisitos.length - 1) {

      const elementoAbajo = this.admision.requisitos[requisito.index + 1];
      this.admision.requisitos[requisito.index + 1] = requisito;
      this.admision.requisitos[requisito.index] = elementoAbajo;
    }

    this.guardarAdmision();
  }

  guardarAdmision() {

    this.admisionesService.mantenimiento('U', this.admision)
      .subscribe(result => {

        if (result.success) {

          M.toast({ html: 'Registro guardado.' }, 1500);
          this.getAdmisiones();
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

  getAdmisiones() {

    this.loadingAdmision = true;

    this.admisionesService.getAdmisionById(this.idAdmision)
      .subscribe(response => {

        if (response.success) {

          this.admision = response.data;
          this.setRequisitos();
          this.setDetalles();
        } else {
          M.toast({ html: 'No se pudo cargar los datos, inténtelo más tarde.' }, 1500);
          console.log(response.error);
        }

        this.loadingAdmision = false;
      },
        error => {
          M.toast({ html: 'No se pudo cargar los datos, inténtelo más tarde.' }, 1500);
          console.log(error);
          this.loadingAdmision = false;
        });
  }

  setDetalles() {

    this.detalles = [];

    if (!this.admision.detalles) {
      return;
    }

    this.admision.detalles.forEach(detalle => {
      this.detalles.push(detalle);
    });
  }

  setRequisitos() {

    this.requisitos = [];

    if (!this.admision.requisitos) {
      return;
    }

    this.admision.requisitos.forEach(requisito => {
      this.requisitos.push(requisito);
    });
  }

}
