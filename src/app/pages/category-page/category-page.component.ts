import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Store } from '@ngrx/store';
import { EMPTY, map, Observable, switchMap } from 'rxjs';
import { selectHasPendingRequest } from 'src/app/store/a.selectors';
import { selectItems } from 'src/app/store/w.selectors';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss'],
})
export class CategoryPageComponent implements OnInit {
  hasRequestPending$ = this.store.select(selectHasPendingRequest);
  activeCategory$: Observable<string | null> = EMPTY;
  items$ = this.store.select(selectItems);

  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnInit(): void {
    this.activeCategory$ = this.route.paramMap.pipe(
      map((params: ParamMap) => params.get('category'))
    );
  }
}
