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
  const { appid, currency, market_hash_name, language, country } = init();
  const itemPrice: IResponse<IPrice | IPriceError> = await createReq(
    PRICE_OVERVIEW_URL(appid, language, currency, market_hash_name)
  );
  const itemPriceHistrory: IResponse<IPriceHistory | IPriceError> = await createReq(
    PRICE_HISTIRY_URL(appid, language, currency, market_hash_name)
  );
  const itemTypeInfo: IResponse<ItemType | IPriceError> = await createReq(
    ITEM_TYPE_URL(appid, country, currency, market_hash_name)
  );
  if (itemPrice.data.success && itemPriceHistrory.data.success && itemTypeInfo.data.success) {
    console.log(itemPrice.data.lowest_price);
    console.log(getAveragePricePerYear(itemPriceHistrory.data.prices));
    console.log(itemTypeInfo.data.assets[appid][2][Object.keys(itemTypeInfo.data.assets[appid][2])[0]]);
  }
})();
