import { Component, OnInit } from '@angular/core';
import { Item } from '../../domain';
import { ActivatedRoute } from 'testing';
import { DomainService } from '../../domain.service';

@Component({
  selector: 'app-item-delete',
  templateUrl: './item-delete.component.html',
  styleUrls: ['./item-delete.component.css']
})
export class ItemDeleteComponent implements OnInit {

  isLoading = true;
  item: Item;

  constructor(
    private route: ActivatedRoute,
    private service: DomainService,
  ) { }

  ngOnInit() {
    const id = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.service.getItem(id).subscribe({
      next: (result) => {
        this.item = result.data;
      },
      error: (e) => { },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

}
