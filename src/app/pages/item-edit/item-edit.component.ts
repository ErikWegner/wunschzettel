import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from 'testing';
import { DomainService } from '../../domain.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.css']
})
export class ItemEditComponent implements OnInit {

  isLoading = true;
  hasData = false;

  title = new FormControl('');
  description = new FormControl('');

  constructor(
    private route: ActivatedRoute,
    private service: DomainService,
  ) { }

  ngOnInit() {
    const id = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.service.getItem(id).subscribe({
      next: (result) => {
        this.title.setValue(result.data.title);
        this.description.setValue(result.data.description);
        this.hasData = true;
      },
      error: (e) => { },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

}
