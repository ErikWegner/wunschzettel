/* tslint:disable:variable-name */
export class Wunschzetteleintrag {
  id: number = 0;
  Title: string = '';
  Description: string = '';
  Category: string = '';
  ImgageUrl: string = '';
  BuyUrl: string = '';
  PriceFrom: string = '';
  PriceTo: string = '';

  constructor(
    id: number = 0,
    title: string = '',
    description: string = '',
    category: string = ''
  ) {
    this.id = id;
    this.Title = title;
    this.Description = description;
    this.Category = category;
  }
}
