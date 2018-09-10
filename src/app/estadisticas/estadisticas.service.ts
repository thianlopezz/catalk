import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {

  constructor(private http: Http) { }

  getEstadisticas() {

    return this.http.get('/private/estadisticas/', this.jwt())
      .pipe(map((response: Response) => response.json()));
  }

  getEstadisticasCorreo() {

    return this.http.get('/private/estadisticas/correos/', this.jwt())
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
