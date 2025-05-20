import { Component } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {RouterLink} from '@angular/router';


@Component({
  selector: 'app-head-bar',
  imports: [
    MatToolbarModule, MatButtonModule, MatIconModule, MatMenuTrigger, MatMenu, MatMenuItem, RouterLink
  ],
  templateUrl: './head-bar.component.html',
  styleUrl: './head-bar.component.css'
})
export class HeadBarComponent {

}
