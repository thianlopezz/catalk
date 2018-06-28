import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdmisionesService {

  constructor(private http: Http) { }

  getAdmisiones() {

    return this.http.get('/private/admisiones/', this.jwt())
      .pipe(map((response: Response) => response.json()));
  }

  getAdmisionById(idAdmision) {

    return this.http.get('/private/admisiones/' + idAdmision, this.jwt())
      .pipe(map((response: Response) => response.json()));
  }

  mantenimiento(accion, admision) {
    return this.http.post('/private/admisiones/' + accion, admision, this.jwt())
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
