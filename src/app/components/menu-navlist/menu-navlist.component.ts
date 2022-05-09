import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCategories } from 'src/app/store/w.selectors';

@Component({
  selector: 'app-menu-navlist',
  templateUrl: './menu-navlist.component.html',
  styleUrls: ['./menu-navlist.component.scss'],
})
export class MenuNavlistComponent {
  categories$ = this.store.select(selectCategories);

  constructor(private store: Store) {}
}
