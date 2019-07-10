import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [],
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatInputModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatInputModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
  ]
})
export class CustomMaterialModule { }
