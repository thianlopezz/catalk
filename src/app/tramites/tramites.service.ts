import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TramitesService {

  USUARIO = JSON.parse(localStorage.getItem('session'));

  constructor(private http: Http) { }

  geTramites() {

    return this.http.get('/private/tramites/', this.jwt())
      .pipe(map((response: Response) => response.json()));
  }

  getTramiteById(idTramite) {

    return this.http.get('/api/tramites/' + idTramite)
      .pipe(map((response: Response) => response.json()));
  }

  mantenimiento(accion, tramite) {

    tramite.idUsuario = this.USUARIO._id;

    return this.http.post('/private/tramites/' + accion, tramite, this.jwt())
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
