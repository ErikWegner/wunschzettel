import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DomainService } from '../domain.service';
import { Category, Item, Result } from '../domain';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css']
})
export class ItemsListComponent implements OnInit {

  isLoading = true;
  items: Item[];

  constructor(
    private route: ActivatedRoute,
    private service: DomainService,
  ) { }

  ngOnInit() {
    const categoryName = this.route.snapshot.paramMap.get('category');
    const category = new Category(categoryName);
    this.service.getItemsByCategory(category).subscribe({
      next: (result) => {
        this.items = result.data;
      },
      error: (e) => { },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

}
