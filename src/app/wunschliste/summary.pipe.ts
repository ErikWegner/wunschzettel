import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'summary'
})
export class SummaryPipe implements PipeTransform {
  transform(text: string) {
    let i = text.indexOf('<br');
    if (i > -1) {
      return text.substring(0, i);
    }

    return text;
  }
}
