import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdmisionesService } from '../admisiones/admisiones.service';

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

  constructor(private activatedRoute: ActivatedRoute,
    private admisionesService: AdmisionesService) {

    this.idAdmision = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getAdmisiones();
  }

  ngAfterViewInit() {

    jQuery('.tabs').tabs();
  }

  addNuevoDetalle() {

    this.detalles.push({ accion: 'I', descripcion: '' });
  }

  addNuevoRequisito() {

    this.requisitos.push({ accion: 'I', descripcion: '' });
  }

  onInsertarDetalle(detalle) {
    if (!this.admision.detalles) {
      this.admision.detalles = [];
    }

    this.admision.detalles.push(detalle.descripcion);
    this.guardarAdmision();
  }

  onInsertarRequisito(requisito) {
    if (!this.admision.requisitos) {
      this.admision.requisitos = [];
    }

    this.admision.requisitos.push(requisito.descripcion);
    this.guardarAdmision();
  }

  onEditarDetalle(detalle) {

    const _detalle = Object.assign([], this.detalles);
    _detalle[detalle.index].accion = 'U';
    this.detalles = _detalle;
  }

  onEditarRequisito(requisito) {

    const _requisito = Object.assign([], this.requisitos);
    _requisito[requisito.index].accion = 'U';
    this.requisitos = _requisito;
  }

  onModificarDetalle(detalle) {

    this.admision.detalles[detalle.index] = detalle.descripcion;
    this.guardarAdmision();
  }

  onModificarRequisito(requisito) {

    this.admision.requisitos[requisito.index] = requisito.descripcion;
    this.guardarAdmision();
  }

  onCancelarDetalle(detalle) {

    if (detalle.accion === 'I') {
      this.detalles.splice(detalle.index, 1);
    } else if (detalle.accion === 'U') {
      this.detalles[detalle.index] = { descripcion: this.detalles[detalle.index].descripcion };
    }
  }

  onCancelarRequisito(requisito) {

    if (requisito.accion === 'I') {
      this.requisitos.splice(requisito.index, 1);
    } else if (requisito.accion === 'U') {
      this.requisitos[requisito.index] = { descripcion: this.requisitos[requisito.index].descripcion };
    }
  }

  onArribaDetalle(detalle) {

    if (detalle.index === 0) {
      return;
    } else if (detalle.index > 0) {

      const elementoArriba = this.admision.detalles[detalle.index - 1];
      this.admision.detalles[detalle.index - 1] = detalle.descripcion;
      this.admision.detalles[detalle.index] = elementoArriba;
    }

    this.guardarAdmision();
  }

  onArribaRequisito(requisito) {

    if (requisito.index === 0) {
      return;
    } else if (requisito.index > 0) {

      const elementoArriba = this.admision.requisitos[requisito.index - 1];
      this.admision.requisitos[requisito.index - 1] = requisito.descripcion;
      this.admision.requisitos[requisito.index] = elementoArriba;
    }

    this.guardarAdmision();
  }

  onAbajoDetalle(detalle) {

    if (detalle.index === this.detalles.length - 1) {
      return;
    } else if (detalle.index < this.detalles.length - 1) {

      const elementoAbajo = this.admision.requisitos[detalle.index + 1];
      this.admision.detalles[detalle.index + 1] = detalle.descripcion;
      this.admision.detalles[detalle.index] = elementoAbajo;
    }

    this.guardarAdmision();
  }

  onAbajoRequisito(requisito) {

    if (requisito.index === this.requisitos.length - 1) {
      return;
    } else if (requisito.index < this.requisitos.length - 1) {

      const elementoAbajo = this.admision.requisitos[requisito.index + 1];
      this.admision.requisitos[requisito.index + 1] = requisito.descripcion;
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
      this.detalles.push({ descripcion: detalle });
    });
  }

  setRequisitos() {

    this.requisitos = [];

    if (!this.admision.requisitos) {
      return;
    }

    this.admision.requisitos.forEach(requisito => {
      this.requisitos.push({ descripcion: requisito });
    });
  }

}
