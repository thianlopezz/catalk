import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { SessionService } from '../../login/session.service';
import { Router } from '@angular/router';

declare var jQuery: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit, AfterViewChecked {

  usuario;

  constructor(private router: Router,
    private cdRef: ChangeDetectorRef,
    private sessionService: SessionService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {

    // jQuery('.button-collapse').sidenav();
    jQuery('.tooltipped').tooltip({ delay: 50 });
    jQuery('.dropdown-trigger').dropdown();
    jQuery('.sidenav').sidenav();
    this.usuario = this.sessionService.getSession();
  }

  ngAfterViewChecked() {

    this.usuario = this.sessionService.getSession();
    this.cdRef.detectChanges();
  }

  logOut() {

    this.sessionService.logOut();
    this.router.navigate(['/login']);
  }

}
