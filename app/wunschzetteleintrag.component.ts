import { Component, Input } from '@angular/core';

import { WunschzettelService } from './ws.service';
import { Wunschzetteleintrag } from './wunschzetteleintrag';

@Component({
  selector: 'my-wunschzetteleintrag',
  styleUrls: ['app/wunschzetteleintrag.component.css'],
  templateUrl: 'app/wunschzetteleintrag.component.html'
})
export class WunschzetteleintragComponent {
  @Input() wunsch: Wunschzetteleintrag
  statusIsVisible = false
  statusButtonActive = true;
  wunschStatus = false; // unknown
  errorText = "";
  
  constructor(
    private service: WunschzettelService) {
  }
    
  onShowStatus() {
    this.statusButtonActive = false;
    this.statusIsVisible = false;
    
    this.service.getItemStatus(this.wunsch.id).subscribe(
      result => {
         this.wunschStatus = result.status;
         this.statusButtonActive = true;
         this.statusIsVisible = true;
      },
      error => this.errorText = <any>error
    );
  }
}