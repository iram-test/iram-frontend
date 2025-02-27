import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-test-run-summary',
  templateUrl: './test-run-details.component.html',
  styleUrls: ['./test-run-details.component.less']
})
export class TestRunDetailsComponent implements OnInit, AfterViewInit {
  chart: any;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  createChart() {
    this.chart = new Chart('testRunSummaryChart', {
      type: 'doughnut',
      data: {
        labels: ['Passed', 'Failed', 'Retest'],
        datasets: [{
          label: 'Test Results',
          data: [3, 1, 5], // Данные для Passed и Failed
          backgroundColor: [
            '#4CAF50', // Зеленый для Passed
            '#F44336', // Красный для Failed
            '#F4C500'
          ],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false, // Отключаем легенду
          },
          title: {
            display: false,
          }
        }
      }
    });
  }
}