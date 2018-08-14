import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TramitesService } from './tramites.service';

declare var jQuery: any;
declare var M: any;

@Component({
  selector: 'app-tramites',
  templateUrl: './tramites.component.html',
  styleUrls: ['./tramites.component.css']
})
export class TramitesComponent implements OnInit, AfterViewInit {

  estado = 'lista';

  loadingTramites;

  tramites = [];
  model: any = {};

  idTramite;

  mensajeConfirmacion;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private tramitesService: TramitesService) {

    this.idTramite = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.idTramite) {
      this.estado = 'formulario';
    }
  }

  ngOnInit() {
    this.getTramites();
  }

  ngAfterViewInit() {
    jQuery('.fixed-action-btn').floatingActionButton();
    jQuery('.modal').modal();
  }

  onSuccessForm() {

    this.estado = 'lista';
    this.getTramites();
  }

  onCancelarForm() {

    this.estado = 'lista';
    this.model = {};
  }

  getTramites() {

    this.loadingTramites = true;

    this.tramitesService.getTramites()
      .subscribe(response => {

        if (response.success) {

          this.tramites = response.data;

          if (this.idTramite) {

            this.model = this.tramites.find(x => x._id === this.idTramite);

            setTimeout(() => {
              M.updateTextFields();
            }, 100);
          }
        } else {
          M.toast({ html: 'No se pudo cargar los trámites, inténtelo más tarde.' }, 1500);
          console.log(response.error);
        }

        this.loadingTramites = false;
      },
        error => {
          M.toast({ html: 'No se pudo cargar los trámites, inténtelo más tarde.' }, 1500);
          console.log(error);
          this.loadingTramites = false;
        });
  }

  onDetalle(tramite) {

    this.router.navigate(['/tramites', tramite._id]);
  }

  onEditar(tramite) {

    this.estado = 'formulario';
    this.model = tramite;
  }

  onEliminar(tramite) {
    this.model = tramite;
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

    this.tramitesService.mantenimiento('D', this.model)
      .subscribe(result => {

        if (result.success) {

          M.toast({ html: 'Registro guardado.' }, 1500);
          this.getTramites();
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
