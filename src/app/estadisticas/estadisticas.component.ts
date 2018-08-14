import { Component, OnInit } from '@angular/core';
import { EstadisticasService } from './estadisticas.service';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {

  constructor(private estaditicasService: EstadisticasService) { }

  ngOnInit() {

    this.getEstadisticas();
  }

  getEstadisticas() {

    this.estaditicasService.getEstadisticas()
      .subscribe(response => {

        console.log(response);
      }, error => {

      });
  }

}
