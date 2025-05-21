import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';

// Chart.js Imports
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-emicalc',
  standalone: true, // Use standalone components
  imports: [
    ReactiveFormsModule,
    CommonModule, // Needed for directives like ngIf
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSliderModule
  ],
  templateUrl: './emicalc.component.html',
  styleUrl: './emicalc.component.css'
})

export class EmicalcComponent implements AfterViewInit {
  // ViewChild to get a reference to the canvas element
  @ViewChild('amortizationChart') chartCanvas!: ElementRef;
  public chart: Chart | undefined; // Chart.js instance

  emiForm: FormGroup = new FormGroup({
    principal: new FormControl(null, [Validators.required, Validators.min(1)]),
    interest: new FormControl(null, [Validators.required, Validators.min(0.01)]),
    years: new FormControl(1, [Validators.required, Validators.min(1)]) // Default to 1 year
  });

  emiResult: number | null = null;
  totalAmountPaid: number | null = null;
  totalInterest: number | null = null;
  graphData: { year: number, remainingPrincipal: number }[] = [];

  constructor() {
    // Register Chart.js components globally once
    Chart.register(...registerables);

    // Watch for changes in years slider to update immediately if needed
    this.emiForm.controls['years'].valueChanges.subscribe(() => {
      if (this.emiForm.valid) {
        this.calculate();
      }
    });
  }

  ngAfterViewInit(): void {
    // Initial calculation and chart rendering when component view is initialized
    if (this.emiForm.valid) {
      this.calculate();
    }
  }

  formatLabel(value: number): string {
    return `${value} Years`;
  }

  calculate(): void {
    if (this.emiForm.valid) {
      const principal = this.emiForm.value.principal;
      const annualInterestRate = this.emiForm.value.interest;
      const years = this.emiForm.value.years;

      // Convert annual interest rate to monthly interest rate
      const monthlyInterestRate = annualInterestRate / 100 / 12;
      // Convert years to total number of months
      const totalMonths = years * 12;

      if (monthlyInterestRate === 0) {
        // Simple interest calculation if interest rate is 0
        this.emiResult = principal / totalMonths;
        this.totalAmountPaid = principal;
        this.totalInterest = 0;
      } else {
        // EMI formula: P * R * (1 + R)^N / ((1 + R)^N - 1)
        const numerator = principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths);
        const denominator = Math.pow(1 + monthlyInterestRate, totalMonths) - 1;
        this.emiResult = numerator / denominator;

        this.totalAmountPaid = this.emiResult * totalMonths;
        this.totalInterest = this.totalAmountPaid - principal;
      }

      this.generateGraphData(principal, monthlyInterestRate, totalMonths);
      this.renderChart(); // Render or update the chart after calculation
    } else {
      this.emiResult = null;
      this.totalAmountPaid = null;
      this.totalInterest = null;
      this.graphData = [];
      this.emiForm.markAllAsTouched(); // Show validation errors
      if (this.chart) {
        this.chart.destroy(); // Destroy chart if form is invalid
        this.chart = undefined;
      }
    }
  }

  // Function to calculate remaining principal for the graph
  generateGraphData(principal: number, monthlyInterestRate: number, totalMonths: number): void {
    this.graphData = [];
    const emi = this.emiResult || 0;

    let currentPrincipal = principal;
    // Add initial principal as a data point at year 0
    this.graphData.push({
      year: 0,
      remainingPrincipal: principal
    });

    for (let month = 1; month <= totalMonths; month++) {
      const interestPayment = currentPrincipal * monthlyInterestRate;
      const principalPayment = emi - interestPayment;
      currentPrincipal -= principalPayment;

      // Add data point for each full year
      if (month % 12 === 0) {
        this.graphData.push({
          year: month / 12,
          remainingPrincipal: Math.max(0, currentPrincipal) // Ensure it doesn't go negative
        });
      }
    }
    // Ensure the final point (at totalMonths) is included if not already at a full year mark
    if (totalMonths % 12 !== 0) {
      this.graphData.push({
        year: totalMonths / 12, // Represents the exact end of the loan
        remainingPrincipal: Math.max(0, currentPrincipal)
      });
    }
  }

  // Function to render the Chart.js graph
  renderChart(): void {
    if (this.chart) {
      this.chart.destroy(); // Destroy existing chart instance before creating a new one
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2D context for canvas.');
      return;
    }

    this.chart = new Chart(ctx, {
      type: 'line', // Line chart for amortization
      data: {
        labels: this.graphData.map(data => data.year === 0 ? 'Start' : `${data.year} Years`), // X-axis labels (Years)
        datasets: [{
          label: 'Remaining Principal',
          data: this.graphData.map(data => data.remainingPrincipal), // Y-axis data (Remaining Principal)
          borderColor: '#64b5f6', // Light blue line color
          backgroundColor: 'rgba(100, 181, 246, 0.2)', // Light blue fill color
          fill: true,
          tension: 0.3, // Smooth the line
          pointBackgroundColor: '#64b5f6',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#64b5f6',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Allow canvas to resize freely
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#fff' // White legend text
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) { // Removed explicit type annotation here
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time (Years)',
              color: '#fff' // White X-axis title
            },
            ticks: {
              color: '#ccc' // Light gray X-axis tick labels
            },
            grid: {
              color: '#333' // Darker grid lines
            }
          },
          y: {
            title: {
              display: true,
              text: 'Principal Amount ($)',
              color: '#fff' // White Y-axis title
            },
            ticks: {
              color: '#ccc', // Light gray Y-axis tick labels
              callback: function(value) {
                return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value as number);
              }
            },
            grid: {
              color: '#333' // Darker grid lines
            }
          }
        }
      }
    });
  }
}
