import { Component, OnInit, AfterViewInit } from '@angular/core';
import { EstadisticasService } from './estadisticas.service';

import * as moment from 'moment';
import { ChartOp } from '../models/chart-op';

declare var jQuery: any;
declare var M: any;

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit, AfterViewInit {

  estadisticas;
  correos = [];

  chartOpGeneralPorMes: ChartOp;

  chartOpAdmisionesPorMes: ChartOp;
  chartOpTramitesPorMes: ChartOp;
  chartOpModelosPorMes: ChartOp;

  chartOpCorreosAdmisionesPorMes: ChartOp;
  chartOpCorreosTramitesPorMes: ChartOp;
  chartOpCorreosModelosPorMes: ChartOp;

  constructor(private estaditicasService: EstadisticasService) { }

  ngOnInit() {

    this.getEstadisticas();
    this.getEstadisticasCorreos();
  }

  ngAfterViewInit() {

    // jQuery('.tooltipped').tooltip().destroy();

    setTimeout(() => {
      M.updateTextFields();
      this.setDesdeHasta();
    }, 100);
  }

  // PARA SETEAR EN UN INICIO FECHA DESDE HOY HASTA
  // UN ANIO ATRAS
  setDesdeHasta() {

    const fechaHoy = moment();
    const fechaAnioAtras = moment().subtract(1, 'years');

    const self = this;

    jQuery('#feDesde').datepicker({
      defaultDate: fechaAnioAtras.toDate(),
      format: 'dd/mm/yyyy',
      setDefaultDate: true,
      onSelect: function (dateText) {
        const fecha = moment(dateText);
        jQuery('#feDesde').val(fecha.format('DD[/]MM[/]YYYY'));
        self.procesaEstadisticas();
      }
    });

    jQuery('#feHasta').datepicker({
      defaultDate: fechaHoy.toDate(),
      format: 'dd/mm/yyyy',
      setDefaultDate: true,
      onSelect: function (dateText) {
        const fecha = moment(dateText);
        jQuery('#feHasta').val(fecha.format('DD[/]MM[/]YYYY'));
        self.procesaEstadisticas();
      }
    });
  }

  estadisticaGeneral() {

    // tslint:disable-next-line:prefer-const
    let labels = [];
    // tslint:disable-next-line:prefer-const
    let data_admisiones = [];
    // tslint:disable-next-line:prefer-const
    let data_modelos = [];
    // tslint:disable-next-line:prefer-const
    let data_tramites = [];

    let feDesde = jQuery('#feDesde').val().split('/');
    let feHasta = jQuery('#feHasta').val().split('/');

    feDesde = moment({ d: feDesde[0], M: Number(feDesde[1]) - 1, y: feDesde[2] });
    feHasta = moment({ d: feHasta[0], M: Number(feHasta[1]) - 1, y: feHasta[2] });

    while (feHasta.format('MM') !== feDesde.format('MM') ||
      feHasta.format('YYYY') !== feDesde.format('YYYY')) {

      feDesde.add(1, 'months');

      labels.push(feDesde.format('MM') + '/' + feDesde.format('YYYY'));

      // FILTRO ADMISION POR MES
      const admision = this.estadisticas.generalPorMes.find(x => x._id.tipo === 'ADMISIONES'
        && x._id.mes === Number(feDesde.format('MM'))
        && x._id.anio === Number(feDesde.format('YYYY')));

      if (admision) {
        data_admisiones.push(admision.count);
      } else {
        data_admisiones.push(0);
      }

      // FILTRO MODELOS POR MES
      const modelo = this.estadisticas.generalPorMes.find(x => x._id.tipo === 'MODELOS'
        && x._id.mes === Number(feDesde.format('MM'))
        && x._id.anio === Number(feDesde.format('YYYY')));

      if (modelo) {
        data_modelos.push(modelo.count);
      } else {
        data_modelos.push(0);
      }

      // FILTRO TRAMITES POR MES
      const tramite = this.estadisticas.generalPorMes.find(x => x._id.tipo === 'TRAMITES'
        && x._id.mes === Number(feDesde.format('MM'))
        && x._id.anio === Number(feDesde.format('YYYY')));

      if (tramite) {
        data_tramites.push(tramite.count);
      } else {
        data_tramites.push(0);
      }
    }

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

    this.chartOpGeneralPorMes = new ChartOp('bar', data, {});
  }

  getCorreosAdmisionesPorMes() {

    let feDesde = jQuery('#feDesde').val().split('/');
    let feHasta = jQuery('#feHasta').val().split('/');

    feDesde = moment({ d: feDesde[0], M: Number(feDesde[1]) - 1, y: feDesde[2] });
    feHasta = moment({ d: feHasta[0], M: Number(feHasta[1]) - 1, y: feHasta[2] });

    // tslint:disable-next-line:prefer-const
    let datasets = [];
    // tslint:disable-next-line:prefer-const
    let labels = [];

    for (let i = 0; i < this.estadisticas.admisiones.length; i++) {

      const admision = this.estadisticas.admisiones[i];

      // tslint:disable-next-line:prefer-const
      let data_admision = [];
      labels = [];

      while (feDesde.format('MM') !== feHasta.format('MM') ||
        feDesde.format('YYYY') !== feHasta.format('YYYY')) {

        feDesde.add(1, 'months');

        labels.push(feDesde.format('MM') + '/' + feDesde.format('YYYY'));

        const estadisticaAdmision = this.estadisticas.correosAdmisionesPorMes.find(x => '' + x._id.idTipo === '' + admision._id
          && x._id.mes === Number(feDesde.format('MM'))
          && x._id.anio === Number(feDesde.format('YYYY')));

        if (estadisticaAdmision) {
          data_admision.push(estadisticaAdmision.count);
        } else {
          data_admision.push(0);
        }
      }

      labels.push('');
      data_admision.push(0);

      // GENERO EL COLOR
      const r = (255 / this.estadisticas.admisiones.length) * i;

      datasets.push({
        label: admision.tipoAdmision,
        borderColor: 'rgba(' + r + ', 75, 90, 1)',
        backgroundColor: 'rgba(' + r + ', 75, 90, 0.5)',
        data: data_admision
      });

      feDesde = jQuery('#feDesde').val().split('/');
      feHasta = jQuery('#feHasta').val().split('/');

      feDesde = moment({ d: feDesde[0], M: Number(feDesde[1]) - 1, y: feDesde[2] });
      feHasta = moment({ d: feHasta[0], M: Number(feHasta[1]) - 1, y: feHasta[2] });
    }

    const data = {
      datasets: datasets,
      labels: labels
    };

    this.chartOpCorreosAdmisionesPorMes = new ChartOp('line', data, {});
  }

  getCorreosTramitesPorMes() {

    let feDesde = jQuery('#feDesde').val().split('/');
    let feHasta = jQuery('#feHasta').val().split('/');

    feDesde = moment({ d: feDesde[0], M: Number(feDesde[1]) - 1, y: feDesde[2] });
    feHasta = moment({ d: feHasta[0], M: Number(feHasta[1]) - 1, y: feHasta[2] });

    // tslint:disable-next-line:prefer-const
    let datasets = [];
    // tslint:disable-next-line:prefer-const
    let labels = [];

    for (let i = 0; i < this.estadisticas.tramites.length; i++) {

      const tramite = this.estadisticas.tramites[i];

      // tslint:disable-next-line:prefer-const
      let data_tramite = [];
      labels = [];

      while (feDesde.format('MM') !== feHasta.format('MM') ||
        feDesde.format('YYYY') !== feHasta.format('YYYY')) {

        feDesde.add(1, 'months');

        labels.push(feDesde.format('MM') + '/' + feDesde.format('YYYY'));

        const estadisticaTramite = this.estadisticas.correosTramitesPorMes.find(x => '' + x._id.idTipo === '' + tramite._id
          && x._id.mes === Number(feDesde.format('MM'))
          && x._id.anio === Number(feDesde.format('YYYY')));

        if (estadisticaTramite) {
          data_tramite.push(estadisticaTramite.count);
        } else {
          data_tramite.push(0);
        }
      }

      labels.push('');
      data_tramite.push(0);

      // GENERO EL COLOR
      const r = (255 / this.estadisticas.tramites.length) * i;

      datasets.push({
        label: tramite.tramite,
        borderColor: 'rgba(' + r + ', 75, 90, 1)',
        backgroundColor: 'rgba(' + r + ', 75, 90, 0.5)',
        data: data_tramite
      });

      feDesde = jQuery('#feDesde').val().split('/');
      feHasta = jQuery('#feHasta').val().split('/');

      feDesde = moment({ d: feDesde[0], M: Number(feDesde[1]) - 1, y: feDesde[2] });
      feHasta = moment({ d: feHasta[0], M: Number(feHasta[1]) - 1, y: feHasta[2] });
    }

    const data = {
      datasets: datasets,
      labels: labels
    };

    this.chartOpCorreosTramitesPorMes = new ChartOp('line', data, {});
  }

  getCorreosModelosPorMes() {

    let feDesde = jQuery('#feDesde').val().split('/');
    let feHasta = jQuery('#feHasta').val().split('/');

    feDesde = moment({ d: feDesde[0], M: Number(feDesde[1]) - 1, y: feDesde[2] });
    feHasta = moment({ d: feHasta[0], M: Number(feHasta[1]) - 1, y: feHasta[2] });

    // tslint:disable-next-line:prefer-const
    let datasets = [];
    // tslint:disable-next-line:prefer-const
    let labels = [];

    for (let i = 0; i < this.estadisticas.modelos.length; i++) {

      const modelo = this.estadisticas.modelos[i];

      // tslint:disable-next-line:prefer-const
      let data_modelo = [];
      labels = [];

      while (feDesde.format('MM') !== feHasta.format('MM') ||
        feDesde.format('YYYY') !== feHasta.format('YYYY')) {

        feDesde.add(1, 'months');

        labels.push(feDesde.format('MM') + '/' + feDesde.format('YYYY'));

        const estadisticaModelo = this.estadisticas.correosModelosPorMes.find(x => '' + x._id.idTipo === '' + modelo._id
          && x._id.mes === Number(feDesde.format('MM'))
          && x._id.anio === Number(feDesde.format('YYYY')));

        if (estadisticaModelo) {
          data_modelo.push(estadisticaModelo.count);
        } else {
          data_modelo.push(0);
        }
      }

      labels.push('');
      data_modelo.push(0);

      // GENERO EL COLOR
      const r = (255 / this.estadisticas.modelos.length) * i;

      datasets.push({
        label: modelo.solicitud,
        borderColor: 'rgba(' + r + ', 75, 90, 1)',
        backgroundColor: 'rgba(' + r + ', 75, 90, 0.5)',
        data: data_modelo
      });

      feDesde = jQuery('#feDesde').val().split('/');
      feHasta = jQuery('#feHasta').val().split('/');

      feDesde = moment({ d: feDesde[0], M: Number(feDesde[1]) - 1, y: feDesde[2] });
      feHasta = moment({ d: feHasta[0], M: Number(feHasta[1]) - 1, y: feHasta[2] });
    }

    const data = {
      datasets: datasets,
      labels: labels
    };

    this.chartOpCorreosModelosPorMes = new ChartOp('line', data, {});
  }

  getAdmisionesPorMes() {

    let feDesde = jQuery('#feDesde').val().split('/');
    let feHasta = jQuery('#feHasta').val().split('/');

    feDesde = moment({ d: feDesde[0], M: Number(feDesde[1]) - 1, y: feDesde[2] });
    feHasta = moment({ d: feHasta[0], M: Number(feHasta[1]) - 1, y: feHasta[2] });

    // tslint:disable-next-line:prefer-const
    let datasets = [];
    // tslint:disable-next-line:prefer-const
    let labels = [];

    for (let i = 0; i < this.estadisticas.admisiones.length; i++) {

      const admision = this.estadisticas.admisiones[i];

      // tslint:disable-next-line:prefer-const
      let data_admision = [];
      labels = [];

      while (feDesde.format('MM') !== feHasta.format('MM') ||
        feDesde.format('YYYY') !== feHasta.format('YYYY')) {

        feDesde.add(1, 'months');

        labels.push(feDesde.format('MM') + '/' + feDesde.format('YYYY'));

        const estadisticaAdmision = this.estadisticas.tipoAdmisionesPorMes.find(x => '' + x._id.idTipo === '' + admision._id
          && x._id.mes === Number(feDesde.format('MM'))
          && x._id.anio === Number(feDesde.format('YYYY')));

        if (estadisticaAdmision) {
          data_admision.push(estadisticaAdmision.count);
        } else {
          data_admision.push(0);
        }
      }

      labels.push('');
      data_admision.push(0);

      // GENERO EL COLOR
      const r = (255 / this.estadisticas.admisiones.length) * i;

      datasets.push({
        label: admision.tipoAdmision,
        borderColor: 'rgba(' + r + ', 75, 90, 1)',
        backgroundColor: 'rgba(' + r + ', 75, 90, 0.5)',
        data: data_admision
      });

      feDesde = jQuery('#feDesde').val().split('/');
      feHasta = jQuery('#feHasta').val().split('/');

      feDesde = moment({ d: feDesde[0], M: Number(feDesde[1]) - 1, y: feDesde[2] });
      feHasta = moment({ d: feHasta[0], M: Number(feHasta[1]) - 1, y: feHasta[2] });
    }

    const data = {
      datasets: datasets,
      labels: labels
    };

    this.chartOpAdmisionesPorMes = new ChartOp('line', data, {});
  }

  getTramitesPorMes() {

    let feDesde = jQuery('#feDesde').val().split('/');
    let feHasta = jQuery('#feHasta').val().split('/');

    feDesde = moment({ d: feDesde[0], M: Number(feDesde[1]) - 1, y: feDesde[2] });
    feHasta = moment({ d: feHasta[0], M: Number(feHasta[1]) - 1, y: feHasta[2] });

    // tslint:disable-next-line:prefer-const
    let datasets = [];
    // tslint:disable-next-line:prefer-const
    let labels = [];

    for (let i = 0; i < this.estadisticas.tramites.length; i++) {

      const tramite = this.estadisticas.tramites[i];

      // tslint:disable-next-line:prefer-const
      let data_tramite = [];
      labels = [];

      while (feDesde.format('MM') !== feHasta.format('MM') ||
        feDesde.format('YYYY') !== feHasta.format('YYYY')) {

        feDesde.add(1, 'months');

        labels.push(feDesde.format('MM') + '/' + feDesde.format('YYYY'));

        const estadisticaTramite = this.estadisticas.tipoTramitesPorMes.find(x => '' + x._id.idTipo === '' + tramite._id
          && x._id.mes === Number(feDesde.format('MM'))
          && x._id.anio === Number(feDesde.format('YYYY')));

        if (estadisticaTramite) {
          data_tramite.push(estadisticaTramite.count);
        } else {
          data_tramite.push(0);
        }
      }

      labels.push('');
      data_tramite.push(0);

      // GENERO EL COLOR
      const r = (255 / this.estadisticas.tramites.length) * i;

      datasets.push({
        label: tramite.tramite,
        borderColor: 'rgba(' + r + ', 75, 90, 1)',
        backgroundColor: 'rgba(' + r + ', 75, 90, 0.5)',
        data: data_tramite
      });

      feDesde = jQuery('#feDesde').val().split('/');
      feHasta = jQuery('#feHasta').val().split('/');

      feDesde = moment({ d: feDesde[0], M: Number(feDesde[1]) - 1, y: feDesde[2] });
      feHasta = moment({ d: feHasta[0], M: Number(feHasta[1]) - 1, y: feHasta[2] });
    }

    const data = {
      datasets: datasets,
      labels: labels
    };

    this.chartOpTramitesPorMes = new ChartOp('line', data, {});
  }

  getModelosPorMes() {

    let feDesde = jQuery('#feDesde').val().split('/');
    let feHasta = jQuery('#feHasta').val().split('/');

    feDesde = moment({ d: feDesde[0], M: Number(feDesde[1]) - 1, y: feDesde[2] });
    feHasta = moment({ d: feHasta[0], M: Number(feHasta[1]) - 1, y: feHasta[2] });

    // tslint:disable-next-line:prefer-const
    let datasets = [];
    // tslint:disable-next-line:prefer-const
    let labels = [];

    for (let i = 0; i < this.estadisticas.modelos.length; i++) {

      const modelo = this.estadisticas.modelos[i];

      // tslint:disable-next-line:prefer-const
      let data_modelo = [];
      labels = [];

      while (feDesde.format('MM') !== feHasta.format('MM') ||
        feDesde.format('YYYY') !== feHasta.format('YYYY')) {

        feDesde.add(1, 'months');

        labels.push(feDesde.format('MM') + '/' + feDesde.format('YYYY'));

        const estadisticaModelo = this.estadisticas.tipoModelosPorMes.find(x => '' + x._id.idTipo === '' + modelo._id
          && x._id.mes === Number(feDesde.format('MM'))
          && x._id.anio === Number(feDesde.format('YYYY')));

        if (estadisticaModelo) {
          data_modelo.push(estadisticaModelo.count);
        } else {
          data_modelo.push(0);
        }
      }

      labels.push('');
      data_modelo.push(0);

      // GENERO EL COLOR
      const r = (255 / this.estadisticas.modelos.length) * i;

      datasets.push({
        label: modelo.solicitud,
        borderColor: 'rgba(' + r + ', 75, 90, 1)',
        backgroundColor: 'rgba(' + r + ', 75, 90, 0.5)',
        data: data_modelo
      });

      feDesde = jQuery('#feDesde').val().split('/');
      feHasta = jQuery('#feHasta').val().split('/');

      feDesde = moment({ d: feDesde[0], M: Number(feDesde[1]) - 1, y: feDesde[2] });
      feHasta = moment({ d: feHasta[0], M: Number(feHasta[1]) - 1, y: feHasta[2] });
    }

    const data = {
      datasets: datasets,
      labels: labels
    };

    this.chartOpModelosPorMes = new ChartOp('line', data, {});
  }

  procesaEstadisticas() {

    let feDesde = jQuery('#feDesde').val();
    let feHasta = jQuery('#feHasta').val();

    if (feDesde.trim() === '' || feHasta.trim() === '') {
      return;
    }

    feDesde = feDesde.split('/');
    feHasta = feHasta.split('/');

    feDesde = moment({ d: feDesde[0], M: Number(feDesde[1]) - 1, y: feDesde[2] });
    feHasta = moment({ d: feHasta[0], M: Number(feHasta[1]) - 1, y: feHasta[2] });

    if (feDesde > feHasta) {
      M.toast({ html: 'La fecha desde no puede ser mayor a la fecha hasta.' }, 1500);
      return;
    }

    if (feHasta < feDesde) {
      M.toast({ html: 'La fecha hasta no puede ser menor a la fecha desde.' }, 1500);
      return;
    }

    this.estadisticaGeneral();
    this.getAdmisionesPorMes();
    this.getTramitesPorMes();
    this.getModelosPorMes();
    this.getCorreosAdmisionesPorMes();
    this.getCorreosTramitesPorMes();
    this.getCorreosModelosPorMes();
  }

  getEstadisticas() {

    this.estaditicasService.getEstadisticas()
      .subscribe(response => {

        this.estadisticas = response.data;
        this.procesaEstadisticas();
      }, error => {

      });
  }

  getEstadisticasCorreos() {
    this.estaditicasService.getEstadisticasCorreo()
      .subscribe(response => {
        this.correos = response.data;
      }, error => {
      });
  }

}
