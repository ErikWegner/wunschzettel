import { RouterConfig } from '@angular/router';
import { NoContent } from './no-content';

import { WunschlisteComponent } from './wunschliste';
import { WunschzettelService }  from './service';
import { WunschzetteleintragComponent } from './wunschzetteleintrag';
import { WunschzetteleintragFormComponent } from './wunschzetteleintragform';
import { ReservierungsdialogComponent } from './reservierungsdialog';
import { Category } from './common';

export const routes: RouterConfig = [
  {
    path: '',
    redirectTo: '/wunschliste',
    terminal: true
  }, {
    path: 'wunschliste',
    component: WunschlisteComponent
  }, {
    path: 'wunschliste/details/:id',
    component: WunschzetteleintragComponent,
  }, {
    path: 'wunschliste/bearbeiten',
    component: WunschzetteleintragFormComponent,
  }, {
    path: 'wunschliste/reservierung',
    component: ReservierungsdialogComponent,
  }, {
    path: 'neu',
    component: WunschzetteleintragFormComponent
  },
  // make sure you match the component type string to the require in asyncRoutes
  { path: 'about', component: 'About' },
  { path: '**', component: NoContent },
];

// Async load a component using Webpack's require with es6-promise-loader and webpack `require`
// asyncRoutes is needed for our @angularclass/webpack-toolkit that will allow us to resolve
// the component correctly
export const asyncRoutes: AsyncRoutes = {
  'About': require('es6-promise-loader!./about')
};


// Optimizations for initial loads
// An array of callbacks to be invoked after bootstrap to prefetch async routes
export const prefetchRouteCallbacks: Array<Es6PromiseLoader | Function> = [
  asyncRoutes['About'] // es6-promise-loader returns a function
];


// Es6PromiseLoader and AsyncRoutes interfaces are defined in custom-typings
