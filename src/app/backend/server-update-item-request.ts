export interface ServerUpdateItemRequest {
  action: string;
  captcha: string;
  item: {
    Title: string;
    Description: string;
    Category: string;
    ImgageUrl: string;
    BuyUrl: string;
    id: number;
  };
}
