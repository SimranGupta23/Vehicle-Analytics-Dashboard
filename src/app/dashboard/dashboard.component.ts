import { Component, OnInit, ViewChild } from '@angular/core';
import { EvDataService } from '../services/ev-data.service';
import { Chart, registerables } from 'chart.js';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

Chart.register(...registerables);
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  evData: any[] = [];
  makeChart: any;
  rangeChart: any;
  yearChart: any;

  constructor(private evDataService: EvDataService) { }
  displayedColumns: string[] = ['id', 'make', 'model', 'year', 'type', 'utility', 'city'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.evDataService.getData().subscribe((data) => {
      this.evData = data;
      this.createMakeChart();
      this.createRangeChart();
      this.createYearChart();
      this.dataSource = new MatTableDataSource(this.evData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(this.evData)
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  createMakeChart() {
    const makes = this.evData.map(item => item.Make);
    const uniqueMakes = [...new Set(makes)];

    const makeCounts = uniqueMakes.map(make =>
      makes.filter(m => m === make).length
    );

    this.makeChart = new Chart('makeChart', {
      type: 'pie',
      data: {
        labels: uniqueMakes,
        datasets: [{
          data: makeCounts,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        }
      }
    });
  }

  // Create Bar Chart for Electric Range
  createRangeChart() {
    const models = this.evData.map(item => item.Model);
    const ranges = this.evData.map(item => +item['Electric Range'] || 0);

    const uniqueModels = [...new Set(models)];
    const rangeSums = uniqueModels.map(model =>
      this.evData
        .filter(item => item.Model === model)
        .reduce((sum, item) => sum + (+item['Electric Range'] || 0), 0)
    );

    this.rangeChart = new Chart('rangeChart', {
      type: 'bar',
      data: {
        labels: uniqueModels,
        datasets: [{
          label: 'Total Electric Range',
          data: rangeSums,
          backgroundColor: '#36A2EB',
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Create Line Chart for Vehicle Models by Year
  createYearChart() {
    const years = this.evData.map(item => item['Model Year']);
    const uniqueYears = [...new Set(years)];

    const yearCounts = uniqueYears.map(year =>
      years.filter(y => y === year).length
    );

    this.yearChart = new Chart('yearChart', {
      type: 'line',
      data: {
        labels: uniqueYears,
        datasets: [{
          label: 'Number of Vehicles',
          data: yearCounts,
          borderColor: '#FF6384',
          fill: false,
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

}
