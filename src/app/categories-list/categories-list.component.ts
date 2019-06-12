import { Component, OnInit } from '@angular/core';
import { DomainService } from '../domain.service';
import { Category } from '../domain';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent implements OnInit {

  isLoading = true;
  categories: Category[];

  constructor(
    private dataservice: DomainService
  ) { }

  ngOnInit() {
    this.dataservice.getCategories().subscribe(
      {
        next: (result) => {
         this.categories = result.data;
        },
        error: (e) => { },
        complete: () => {
          this.isLoading = false;
        }
      }
    );
  }

}
