import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  USUARIO = JSON.parse(localStorage.getItem('session'));

  constructor(private http: Http) { }

  getSolicitudes() {

    return this.http.get('/private/solicitudes/', this.jwt())
      .pipe(map((response: Response) => response.json()));
  }

  getSolicitudById(idSolicitud) {

    return this.http.get('/api/solicitudes/' + idSolicitud)
      .pipe(map((response: Response) => response.json()));
  }

  mantenimiento(accion, solicitud) {

    // tslint:disable-next-line:prefer-const
    let data = new FormData();

    if (solicitud._id) { data.append('_id', solicitud._id); }

    data.append('solicitud', solicitud.solicitud);
    data.append('descripcion', solicitud.descripcion);

    if (solicitud.archivo) { data.append('file', solicitud.archivo); }

    const detalle = solicitud.detalles || [];
    data.append('detalles', JSON.stringify(detalle));

    data.append('idUsuario', this.USUARIO._id);

    return this.http.post('/private/solicitudes/' + accion, data, this.jwt())
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
