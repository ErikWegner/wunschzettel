import { Item } from 'src/app/domain';
import { ListResponse } from 'src/app/backend';

export class ItemMapper {
  static asServerResponse(items: Item[]): ListResponse {
    return {
      data: items.map(
        item => ({
          Title: item.title,
          Description: item.description,
          Category: item.category,
          ImgageUrl: item.imagesrc,
          BuyUrl: item.buyurl,
          id: item.id
        })
      )
    };
  }
}
