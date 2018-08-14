import { Component, OnInit, OnChanges, SimpleChanges, ViewChild, Input, ElementRef } from '@angular/core';

import Chart from 'chart.js';
import { ChartOp } from '../../models/chartop';

@Component({
  selector: 'app-card-estadistica-barras',
  templateUrl: './card-estadistica-barras.component.html',
  styleUrls: ['./card-estadistica-barras.component.css']
})
export class CardEstadisticaBarrasComponent implements OnInit, OnChanges {

  @ViewChild('myChart') myChart: ElementRef;

  @Input() titulo = '';
  @Input() chart_op: ChartOp;

  chart;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.chart_op.firstChange) {
      return;
    }

    const _chart_op = changes.chart_op.currentValue || {};

    if (this.chart === undefined) {

      const _chart = this.myChart.nativeElement.getContext('2d');

      this.chart = new Chart(
        _chart,
        {
          'type': _chart_op.type || 'line',
          'data': _chart_op.data || {},
          'options': _chart_op.options || {}
        }
      );

    }

    this.chart.data.labels.pop();
    this.chart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    });

    this.chart.data = _chart_op.data;
    this.chart.update();
  }

}
