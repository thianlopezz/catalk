import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: Http) { }

  getUsuarios() {

    return this.http.get('/private/usuarios/', this.jwt())
      .pipe(map((response: Response) => response.json()));
  }

  getUsuarioById(idUsuario) {

    return this.http.get('/private/usuarios/' + idUsuario)
      .pipe(map((response: Response) => response.json()));
  }

  mantenimiento(accion, usuario) {

    const USUARIO = JSON.parse(localStorage.getItem('session'));
    usuario.idUsuario = USUARIO._id;

    return this.http.post('/private/usuarios/' + accion, usuario, this.jwt())
      .pipe(map((response: Response) => response.json()));
  }

  cambiaContrasena(contrasenas) {

    const USUARIO = JSON.parse(localStorage.getItem('session'));
    contrasenas.idUsuario = USUARIO._id;

    return this.http.post('/private/usuario/contrasena', contrasenas, this.jwt())
      .pipe(map((response: Response) => response.json()));
  }

  olvideContrasena(data) {

    return this.http.post('/api/usuario/contrasena', data)
      .pipe(map((response: Response) => response.json()));
  }

  recuperaContrasena(contrasenas) {

    return this.http.post('/api/usuario/contrasena/recupera', contrasenas)
      .pipe(map((response: Response) => response.json()));
  }

  private jwt() {

    const usuario = JSON.parse(localStorage.getItem('session'));

    if (usuario && usuario.token) {
      const headers = new Headers({ 'x-access-token': usuario.token });
      return new RequestOptions({ headers: headers });
    }
  }
}
