import {
  createReq,
  PRICE_HISTIRY_URL,
  PRICE_OVERVIEW_URL,
  IResponse,
  IPrice,
  IPriceHistory,
  IPriceError,
  ITEM_TYPE_URL,
  ItemType
} from './API';
import { init, getAveragePricePerYear } from './utils';

(async () => {
  const { gameID, currency, itemName, language, country } = init();
  const itemPrice: IResponse<IPrice | IPriceError> = await createReq(
    PRICE_OVERVIEW_URL(gameID, language, currency, itemName)
  );
  const itemPriceHistrory: IResponse<IPriceHistory | IPriceError> = await createReq(
    PRICE_HISTIRY_URL(gameID, language, currency, itemName)
  );
  const itemTypeInfo: IResponse<ItemType | IPriceError> = await createReq(
    ITEM_TYPE_URL(gameID, country, currency, itemName)
  );
  if (itemPrice.data.success && itemPriceHistrory.data.success && itemTypeInfo.data.success) {
    console.log(itemPrice.data.lowest_price);
    console.log(getAveragePricePerYear(itemPriceHistrory.data.prices));
    console.log(itemTypeInfo.data.assets[gameID][2][Object.keys(itemTypeInfo.data.assets[gameID][2])[0]]);
  }
})();
