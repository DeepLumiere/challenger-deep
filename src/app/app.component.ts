import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {Menubar} from 'primeng/menubar';
import {MenuItem, PrimeTemplate} from 'primeng/api';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menubar, PrimeTemplate, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'challenger-deep';
  items: MenuItem[] = [
    { label: 'About', routerLink: '/about' },
    { label: 'Projects', routerLink: '/projects' },
    { label: 'Contact Us', routerLink: '/contactus' },
    { label: 'Inspire', routerLink: '/inspire' },
    { label: 'EMI Calc', routerLink: '/emicalc' }
  ];

}
