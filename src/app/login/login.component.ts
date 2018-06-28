import { Component, OnInit } from '@angular/core';
import { SessionService } from './session.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

declare var M: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: any = {};

  constructor(private router: Router,
    private sessionService: SessionService) { }

  ngOnInit() {
  }

  login(f: NgForm) {

    if (!f.valid) {

      M.toast({ html: 'Completa todos los campos para iniciar sesión.' }, 1500);
      return;
    }

    this.sessionService.login(this.model)
      .subscribe(result => {

        if (result.success) {

          this.router.navigate(['/ds']);
        } else {

          M.toast({ html: result.mensaje }, 1500);
        }
      },
        error => {

          M.toast('Ocurrió un error inténtelo más tarde.', 1500);
          console.log(error);
        });
  }

}
