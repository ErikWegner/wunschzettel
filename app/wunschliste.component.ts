import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router-deprecated';

import { Wunschzetteleintrag } from './wunschzetteleintrag';
import { Category }            from './category';
import { WunschzettelService } from './ws.service';

@Component({
  selector: 'my-wunschliste',
  templateUrl: 'app/wunschliste.component.html'
})
export class WunschlisteComponent implements OnInit {
  items: Wunschzetteleintrag[]
  
  constructor(
    private router: Router,
    private service: WunschzettelService) {
      this.items = [];
  }
  
  ngOnInit() {
    this.service.getItems()
    .subscribe(
      items => this.items = items
    );
  }
}