import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeadBarComponent} from '../head-bar/head-bar.component';
import {FootBarComponent} from '../foot-bar/foot-bar.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeadBarComponent, FootBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'challenger-deep';
}
