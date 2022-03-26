import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { moduleMetadata } from '@storybook/angular';

export const decorators = [
  moduleMetadata({
    declarations: [],
    imports: [
      MatButtonModule,
      MatCardModule,
      MatIconModule,
      MatListModule,
      MatSidenavModule,
      MatToolbarModule,
    ],
  }),
];
