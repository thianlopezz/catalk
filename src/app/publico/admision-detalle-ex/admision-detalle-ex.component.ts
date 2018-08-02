import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { AdmisionesService } from '../../admisiones/admisiones.service';

declare var jQuery: any;
declare var M: any;

@Component({
  selector: 'app-admision-detalle-ex',
  templateUrl: './admision-detalle-ex.component.html',
  styleUrls: ['./admision-detalle-ex.component.css']
})
export class AdmisionDetalleExComponent implements OnInit, AfterViewInit {

  loading;

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

  getAdmisiones() {

    this.loading = true;

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

        this.loading = false;
      },
        error => {
          M.toast({ html: 'No se pudo cargar los datos, inténtelo más tarde.' }, 1500);
          console.log(error);
          this.loading = false;
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
