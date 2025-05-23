import {Component, ViewChild, ElementRef, AfterViewInit, OnInit} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf


// Chart.js Imports
import { Chart, registerables } from 'chart.js';
import {CardModule} from 'primeng/card'; // Changed from Card to CardModule
import {InputTextModule} from 'primeng/inputtext'; // Changed from InputText to InputTextModule
import {ButtonModule} from 'primeng/button'; // Changed from ButtonDirective to ButtonModule
import { SliderModule } from 'primeng/slider'; // Import SliderModule
import { InputNumberModule } from 'primeng/inputnumber'; // Import InputNumberModule


@Component({
  selector: 'app-emicalc',
  standalone: true, // Use standalone components
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CardModule, // Use CardModule
    InputTextModule, // Use InputTextModule
    ButtonModule, // Use ButtonModule
    SliderModule, // Add SliderModule
    InputNumberModule // Add InputNumberModule
  ],
  templateUrl: './emicalc.component.html',
  styleUrl: './emicalc.component.css'
})

export class EmicalcComponent implements OnInit, AfterViewInit { // Implement AfterViewInit
  // ViewChild to get a reference to the canvas element
  @ViewChild('amortizationChart') chartCanvas!: ElementRef;
  public chart: Chart | undefined; // Chart.js instance

  emiForm: FormGroup = new FormGroup({
    principal: new FormControl(2500000, [Validators.required, Validators.min(1)]), // Added default value
    interest: new FormControl(8.5, [Validators.required, Validators.min(0.01)]), // Added default value
    years: new FormControl(15, [Validators.required, Validators.min(1)]) // Default to 1 year, added default value
  });

  emiResult: number | null = null;
  totalAmountPaid: number | null = null;
  totalInterest: number | null = null;
  graphData: { year: number, remainingPrincipal: number }[] = [];

  constructor() {
    // Register Chart.js components globally once
    Chart.register(...registerables);

    // Watch for changes in all form controls to update immediately
    this.emiForm.valueChanges.subscribe(() => {
      if (this.emiForm.valid) {
        this.calculate();
      } else {
        // Optionally clear results and chart if form becomes invalid
        this.emiResult = null;
        this.totalAmountPaid = null;
        this.totalInterest = null;
        this.graphData = [];
        if (this.chart) {
          this.chart.destroy();
          this.chart = undefined;
        }
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
      type: 'line',
      data: {
        labels: this.graphData.map(data => `${data.year} yr`),
        datasets: [{
          label: 'Remaining Principal',
          data: this.graphData.map(data => data.remainingPrincipal),
          borderColor: '#d156d1', // Brighter purple for the line
          backgroundColor: 'rgba(126, 91, 239, 0.2)', // Slightly more transparent dark background
          fill: true,
          tension: 0.4,
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Allow chart to adjust height dynamically
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: context => `₹${context.parsed.y.toFixed(2)}`
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Year',
              color: '#e0e0e0' // White text for x-axis title
            },
            grid: {
              display: false, // Removed grid lines for a cleaner look
              color: 'rgba(255, 255, 255, 0.05)' // Very subtle grid lines if needed
            },
            ticks: {
              color: '#e0e0e0' // White text for x-axis labels
            }
          },
          y: {
            title: {
              display: true,
              text: 'Remaining Principal (₹)',
              color: '#e0e0e0' // White text for y-axis title
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)' // Lighter grid lines
            },
            ticks: {
              color: '#e0e0e0' // White text for y-axis labels
            }
          }
        }
      }
    });
  }

  ngOnInit(): void {
  }
}
