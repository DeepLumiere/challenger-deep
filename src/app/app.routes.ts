import { Routes } from '@angular/router';
import {HomeComponent} from '../home/home.component';
import {AboutComponent} from '../about/about.component';
import {ProjectsComponent} from '../projects/projects.component';
import {ContactusComponent} from '../contactus/contactus.component';
import {InspireComponent} from '../inspire/inspire.component';
import {EmicalcComponent} from '../emicalc/emicalc.component';

export const routes: Routes = [
  {path:"",component:HomeComponent},
  {path:"home",component:HomeComponent},
  {path:"about",component:AboutComponent},
  {path:"projects",component:ProjectsComponent},
  {path:"contactus",component:ContactusComponent},
  {path:"inspire",component:InspireComponent},
  {path:"emicalc",component:EmicalcComponent},

];
