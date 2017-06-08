/* tslint:disable:variable-name */
export class Wunschzetteleintrag {
  public id: number = 0;
  public Title: string = '';
  public Description: string = '';
  public Category: string = '';
  public ImgageUrl: string = '';
  public BuyUrl: string = '';
  public PriceFrom: string = '';
  public PriceTo: string = '';

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
