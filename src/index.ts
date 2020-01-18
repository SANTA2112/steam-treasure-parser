import {
  IPrice,
  IPriceHistory,
  IPriceError,
  IItemTypeResponce,
  IResponse,
  IItemProperties,
  ISubItem
} from './interfaces';
import { ItemDescPropValues, ItemsType } from './types';

import { doReq } from './API';
import { init, getAveragePricePerYear, findItemsInTreause, getItemType, getSubItemsSetParams, sleep } from './utils';
import { PRICE_HISTIRY_URL, PRICE_OVERVIEW_URL, ITEM_TYPE_URL } from './constants';

(async () => {
  const { appid, currency, market_hash_name, language, country } = init();

  const itemPrice: IResponse<IPrice | IPriceError> = await doReq(
    PRICE_OVERVIEW_URL(appid, language, currency, market_hash_name)
  );
  const itemPriceHistrory: IResponse<IPriceHistory | IPriceError> = await doReq(
    PRICE_HISTIRY_URL(appid, language, currency, market_hash_name)
  );
  const itemTypeInfo: IResponse<IItemTypeResponce | IPriceError> = await doReq(
    ITEM_TYPE_URL(appid, country, currency, market_hash_name)
  );

  if (itemPrice.data.success && itemPriceHistrory.data.success && itemTypeInfo.data.success) {
    console.log(itemPrice.data.lowest_price);
    console.log(getAveragePricePerYear(itemPriceHistrory.data.prices));
    const itemInfo: IItemProperties =
      itemTypeInfo.data.assets[appid][2][Object.keys(itemTypeInfo.data.assets[appid][2])[0]];
    const itemType: ItemsType | void = getItemType(itemInfo);
    console.log(itemType);
    if (itemType) {
      const items: ItemDescPropValues[] = findItemsInTreause(appid, itemType, itemInfo);
      const getSubItems: (item: ItemDescPropValues) => Promise<ISubItem[]> = getSubItemsSetParams(appid, itemType);
      for (let item of items) {
        const result: ISubItem[] = await getSubItems(item);
        console.log(result);
      }
    }
  }
})();
