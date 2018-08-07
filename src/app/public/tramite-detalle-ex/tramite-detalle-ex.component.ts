import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { TramitesService } from '../../tramites/tramites.service';

declare var jQuery: any;
declare var M: any;

@Component({
  selector: 'app-tramite-detalle-ex',
  templateUrl: './tramite-detalle-ex.component.html',
  styleUrls: ['./tramite-detalle-ex.component.css']
})
export class TramiteDetalleExComponent implements OnInit, AfterViewInit {

  loading;

  idTramite;
  tramite: any = {};

  detalles: any;
  requisitos: any;

  constructor(private activatedRoute: ActivatedRoute,
    private tramitesService: TramitesService) {

    this.idTramite = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getTramite();
  }

  ngAfterViewInit() {

    jQuery('.tabs').tabs();
  }

  getTramite() {

    this.loading = true;

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

