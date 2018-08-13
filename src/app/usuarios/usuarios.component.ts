import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '../../../node_modules/@angular/router';
import { UsuariosService } from './usuarios.service';
import { Location } from '@angular/common';

declare var jQuery: any;
declare var M: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, AfterViewInit {

  estado = 'lista';

  loadingUsuarios;

  usuarios = [];
  model: any = {};

  contrasena;

  mensajeConfirmacion;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private usuariosService: UsuariosService) {

    this.contrasena = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.contrasena) {
      this.estado = 'contrasena';
    }
  }

  ngOnInit() {
    this.getUsuarios();
  }

  ngAfterViewInit() {
    jQuery('.fixed-action-btn').floatingActionButton();
    jQuery('.modal').modal();
  }

  onSuccessForm() {

    this.estado = 'lista';
    this.getUsuarios();
  }

  onCancelarForm() {

    this.estado = 'lista';
    this.model = {};
  }

  onSuccessContrasena() {
    this.router.navigate(['ds']);
  }

  onCancelarContrasena() {
    this.location.back();
  }

  getUsuarios() {

    this.loadingUsuarios = true;

    this.usuariosService.getUsuarios()
      .subscribe(response => {

        if (response.success) {

          this.usuarios = response.data;
        } else {
          M.toast({ html: 'No se pudo cargar los trámites, inténtelo más tarde.' }, 1500);
          console.log(response.error);
        }

        this.loadingUsuarios = false;
      },
        error => {
          M.toast({ html: 'No se pudo cargar los trámites, inténtelo más tarde.' }, 1500);
          console.log(error);
          this.loadingUsuarios = false;
        });
  }

  onDetalle(tramite) {

    this.router.navigate(['/tramites', tramite._id]);
  }

  onEditar(tramite) {

    this.estado = 'formulario';
    this.model = tramite;
  }

  onNuevo() {

    this.estado = 'formulario';
    this.model = {};
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

    this.usuariosService.mantenimiento('D', this.model)
      .subscribe(result => {

        if (result.success) {

          M.toast({ html: 'Registro eliminado.' }, 1500);
          this.getUsuarios();
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

