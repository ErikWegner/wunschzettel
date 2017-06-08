import { Routes } from '@angular/router';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';
import { WunschlisteComponent } from './wunschliste';
import { WunschzetteleintragComponent } from './wunschzetteleintrag';
import { WunschzetteleintragFormComponent } from './wunschzetteleintragform';
import { ReservierungsdialogComponent } from './reservierungsdialog/index';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: '', redirectTo: '/wunschliste', pathMatch: 'full' },
  { path: 'wunschliste', component: WunschlisteComponent },
  { path: 'wunschliste/details/:id', component: WunschzetteleintragComponent },
  { path: 'wunschliste/bearbeiten', component: WunschzetteleintragFormComponent },
  { path: 'wunschliste/reservierung', component: ReservierungsdialogComponent },
  { path: 'neu', component: WunschzetteleintragFormComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', component: NoContentComponent },
];
