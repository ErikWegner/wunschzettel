import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mySummary'
})
export class SummaryPipe implements PipeTransform {
  public transform(text: string) {
    let i = text.indexOf('<br');
    if (i > -1) {
      return text.substring(0, i);
    }

    return text;
  }
}
