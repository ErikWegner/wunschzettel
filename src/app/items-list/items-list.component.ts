import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DomainService } from '../domain.service';
import { Category, Item, Result } from '../domain';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css']
})
export class ItemsListComponent implements OnInit {

  items$: Observable<Result<Item[]>>;

  constructor(
    private route: ActivatedRoute,
    private service: DomainService,
  ) { }

  ngOnInit() {
    const categoryName = this.route.snapshot.paramMap.get('category');
    const category = new Category(categoryName);
    this.service.getItemsByCategory(category);
  }

}
