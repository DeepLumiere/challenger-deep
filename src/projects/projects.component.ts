import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for ngFor
import { CardModule } from 'primeng/card'; // PrimeNG Card component
import { ButtonModule } from 'primeng/button'; // PrimeNG Button component

interface Project {
  image: string;
  title: string;
  description: string;
  githubLink?: string; // Optional GitHub link
  liveLink?: string; // Optional live website link
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {

  projects: Project[] = [];

  ngOnInit(): void {
    this.projects = [
      {
        image: 'logo.svg', // Placeholder image
        title: 'EMI Calculator',
        description: 'A responsive Equated Monthly Installment (EMI) calculator built with Angular and PrimeNG, featuring real-time calculations and an amortization chart.',
        githubLink: 'https://github.com/DeepLumiere/challenger-deep', // Replace with actual link
        liveLink: 'emicalc' // Replace with actual link
      },
      {
        image: 'logo.svg', // Placeholder image
        title: 'MLodels',
        description: 'Collection of ML Models just for you!',
        githubLink: 'https://github.com/DeepLumiere/ML_Models', // Replace with actual link
        liveLink: 'https://github.com/DeepLumiere/ML_Models' // Replace with actual link
      },

      // Add more projects as needed
    ];
  }
}
