import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  constructor(private http: Http) { }

  getParametros() {

    return this.http.get('/private/parametros/', this.jwt())
      .pipe(map((response: Response) => response.json()));
  }

  mantenimiento(accion, parametros) {

    const USUARIO = JSON.parse(localStorage.getItem('session'));
    parametros.idUsuario = USUARIO._id;

    return this.http.post('/private/parametros/' + accion, parametros, this.jwt())
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
