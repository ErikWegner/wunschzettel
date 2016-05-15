import { Component, Input } from '@angular/core';

import { Wunschzetteleintrag } from './wunschzetteleintrag';

@Component({
  selector: 'my-wunschzetteleintrag',
  styleUrls: ['app/wunschzetteleintrag.component.css'],
  templateUrl: 'app/wunschzetteleintrag.component.html'
})
export class WunschzetteleintragComponent {
  @Input() wunsch: Wunschzetteleintrag
}