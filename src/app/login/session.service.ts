import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';

import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private http: Http) { }

  login(usuario) {

    return this.http.post('/api/login/', usuario)
      .pipe(map((response: Response) => {

        const responseJSON = response.json();

        if (responseJSON.success) {

          usuario = responseJSON.usuario;

          if (usuario && usuario.token) {

            localStorage.setItem('session', JSON.stringify(usuario));
            return responseJSON;
          }
        } else {

          return responseJSON;
        }
      }));
  }

  logOut() {

    localStorage.removeItem('session');
  }

  getSession() {

    return JSON.parse(localStorage.getItem('session'));
  }

  isTokenExpired(token?: string): boolean {
    if (!this.getSession()) { return true; }
    if (!token) { token = this.getSession().token; }
    if (!token) { return true; }

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) { return false; }
    return !(date.valueOf() > new Date().valueOf());
  }

  private getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);

    if (decoded.exp === undefined) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }
}
