import { Component, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'about',
  styleUrls: ['./about.component.css'],
  templateUrl: './about.component.html'
})
export class AboutComponent implements AfterViewInit {
  constructor(
    private el: ElementRef
  ) {

  }

  public ngAfterViewInit() {
    // Material design
    componentHandler.upgradeElements(this.el.nativeElement);
  }
}
