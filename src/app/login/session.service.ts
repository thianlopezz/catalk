import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';

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
}
