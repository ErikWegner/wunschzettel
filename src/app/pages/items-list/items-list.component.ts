import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DomainService } from '../../domain.service';
import { Category, Item, Result } from '../../domain';

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
    private router: Router,
    private service: DomainService,
  ) { }

  ngOnInit() {
    const categoryName = this.route.snapshot.paramMap.get('category');
    const category = new Category(categoryName);
    this.service.getItemsByCategory(category).subscribe({
      next: (result) => {
        if (!result.data || result.data.length === 0) {
          this.router.navigate(['/404'], { skipLocationChange: true });
        }
        this.items = result.data;
      },
      error: (e) => { },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

}
