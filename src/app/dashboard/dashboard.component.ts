import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';
import { EstadisticasService } from '../estadisticas/estadisticas.service';
import { ChartOp } from '../models/chartop';

declare var jQuery: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  estadisticas: any = {};
  chart: ChartOp;

  constructor(private estadisticasService: EstadisticasService) { }

  ngOnInit() {
    this.getEstadisticas();
  }

  getEstadisticas() {

    this.estadisticasService.getEstadisticas()
      .subscribe(response => {

        this.estadisticas = response.data;
        this.estadisticaGeneral(this.estadisticas.generalPorMes);
      }, error => {

      });
  }

  // MUESTRO ESTADISTICA DEL ULTIMO ANIO
  estadisticaGeneral(general) {

    // tslint:disable-next-line:prefer-const
    let labels = [];
    // tslint:disable-next-line:prefer-const
    let data_admisiones = [];
    // tslint:disable-next-line:prefer-const
    let data_modelos = [];
    // tslint:disable-next-line:prefer-const
    let data_tramites = [];

    const fechaHoy = moment();
    const fechaAnioAtras = moment().subtract(1, 'years');

    while (fechaHoy.format('MM') !== fechaAnioAtras.format('MM') ||
      fechaHoy.format('YYYY') !== fechaAnioAtras.format('YYYY')) {

      fechaAnioAtras.add(1, 'months');

      labels.push(fechaAnioAtras.format('MM') + '/' + fechaAnioAtras.format('YYYY'));

      // FILTRO ADMISION POR MES
      const admision = general.find(x => x._id.tipo === 'ADMISIONES'
        && x._id.mes === Number(fechaAnioAtras.format('MM'))
        && x._id.anio === Number(fechaAnioAtras.format('YYYY')));

      if (admision) {
        data_admisiones.push(admision.count);
      } else {
        data_admisiones.push(0);
      }

      // FILTRO MODELOS POR MES
      const modelo = general.find(x => x._id.tipo === 'MODELOS'
        && x._id.mes === Number(fechaAnioAtras.format('MM'))
        && x._id.anio === Number(fechaAnioAtras.format('YYYY')));

      if (modelo) {
        data_modelos.push(modelo.count);
      } else {
        data_modelos.push(0);
      }

      // FILTRO TRAMITES POR MES
      const tramite = general.find(x => x._id.tipo === 'TRAMITES'
        && x._id.mes === Number(fechaAnioAtras.format('MM'))
        && x._id.anio === Number(fechaAnioAtras.format('YYYY')));

      if (tramite) {
        data_tramites.push(tramite.count);
      } else {
        data_tramites.push(0);
      }
    }

    // for (let i = this.contrato.planillas.length - 1; i >= 0; i--) {

    //   const planilla = this.contrato.planillas[i];

    //   labels.push(this.meses[planilla.mes - 1] + ' ' + planilla.anio);

    //   data_valor.push(planilla.valor);
    // }

    labels.push('');
    data_admisiones.push(0);
    data_tramites.push(0);
    data_modelos.push(0);

    const data = {
      datasets: [{
        label: 'Admisiones',
        borderColor: 'rgba(237, 75, 90, 1)',
        backgroundColor: 'rgba(237, 75, 90, 0.5)',
        data: data_admisiones
      },
        {
          label: 'Trámites',
          borderColor: 'rgba(65, 95, 169, 1)',
          backgroundColor: 'rgba(65, 95, 169, 0.5)',
          data: data_tramites
        },
        {
          label: 'Modelo de solicitudes',
          borderColor: 'rgba(71, 189, 160, 1)',
          backgroundColor: 'rgba(71, 189, 160, 0.5)',
          data: data_modelos
        }],
      labels: labels
    };

    this.chart = new ChartOp('bar', data, {});

  }

}
