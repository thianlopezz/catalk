import { Injectable } from '@angular/core';
import { Router, CanActivate } from '../../../node_modules/@angular/router';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class RouteActivatorService implements CanActivate {

  constructor(private router: Router,
    private sessionService: SessionService) { }

  canActivate() {

    if (!this.sessionService.isTokenExpired()) {
      return true;
    }

    this.router.navigate(['/login']);
    this.sessionService.logOut();
    return false;
  }
}
