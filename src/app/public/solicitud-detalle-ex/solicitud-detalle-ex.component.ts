import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { SolicitudesService } from '../../solicitudes/solicitudes.service';

declare var jQuery: any;
declare var M: any;

@Component({
  selector: 'app-solicitud-detalle-ex',
  templateUrl: './solicitud-detalle-ex.component.html',
  styleUrls: ['./solicitud-detalle-ex.component.css']
})
export class SolicitudDetalleExComponent implements OnInit, AfterViewInit {

  loading;

  idSolicitud;
  solicitud: any = {};

  detalles: any;

  constructor(private activatedRoute: ActivatedRoute,
    private solicitudesService: SolicitudesService) {

    this.idSolicitud = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getAdmisiones();
  }

  ngAfterViewInit() {
    jQuery('.tabs').tabs();
  }

  getAdmisiones() {

    this.loading = true;

    this.solicitudesService.getSolicitudById(this.idSolicitud)
      .subscribe(response => {

        if (response.success) {

          this.solicitud = response.data;
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

    if (!this.solicitud.detalles) {
      return;
    }

    this.solicitud.detalles.forEach(detalle => {
      this.detalles.push({ descripcion: detalle });
    });
  }

}
