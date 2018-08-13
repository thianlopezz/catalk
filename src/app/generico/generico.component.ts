import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '../../../node_modules/@angular/router';
import { Location } from '@angular/common';

declare var jQuery: any;
declare var M: any;

@Component({
  selector: 'app-generico',
  templateUrl: './generico.component.html',
  styleUrls: ['./generico.component.css']
})
export class GenericoComponent implements OnInit, AfterViewInit {

  OP;
  token;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute) {

    this.OP = this.activatedRoute.snapshot.paramMap.get('op');
    this.token = this.activatedRoute.snapshot.paramMap.get('token');
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    jQuery('.modal').modal();
  }

  onSuccessOlvideRecupera() {
    this.router.navigate(['/login']);
  }

  onCancelarOlvideRecupera() {
    this.router.navigate(['/login']);
  }
}

