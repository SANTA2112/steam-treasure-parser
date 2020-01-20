import {
  IPrice,
  IPriceHistory,
  IPriceError,
  IItemTypeResponce,
  IResponse,
  IItemProperties,
  ISubItem,
  IItemPropertyDescription
} from './interfaces';
import { ItemDescPropValues, ItemsType, PricesPerYear } from './types';

import { doReq } from './API';
import {
  init,
  getAveragePricePerYear,
  findItemsInTreause,
  getItemType,
  getSubItemsSetParams,
  giveItemsPriceSetParams,
  sleep,
  parallel
} from './utils';
import { PRICE_HISTIRY_URL, PRICE_OVERVIEW_URL, ITEM_TYPE_URL } from './constants';

const main = async () => {
  const { appid, currency, market_hash_name, language, country } = init();

  const itemPrice: IResponse<IPrice | IPriceError> = await doReq(
    PRICE_OVERVIEW_URL(appid, country, currency, market_hash_name)
  );
  const itemPriceHistrory: IResponse<IPriceHistory | IPriceError> = await doReq(
    PRICE_HISTIRY_URL(appid, country, currency, market_hash_name)
  );
  const itemTypeInfo: IResponse<IItemTypeResponce | IPriceError> = await doReq(
    ITEM_TYPE_URL(appid, language, currency, market_hash_name)
  );

  if (itemPrice.data.success && itemPriceHistrory.data.success && itemTypeInfo.data.success) {
    const lowestPrice: string | undefined = itemPrice.data.lowest_price;
    const averagePricePerYear: PricesPerYear = getAveragePricePerYear(itemPriceHistrory.data.prices);
    const itemInfo: IItemProperties =
      itemTypeInfo.data.assets[appid][2][Object.keys(itemTypeInfo.data.assets[appid][2])[0]];
    const itemType: ItemsType | void = getItemType(itemInfo);
    if (itemType) {
      const items: ItemDescPropValues[] = findItemsInTreause(appid, itemType, itemInfo);
      itemInfo.descriptions = items;
      const getSubItems: (item: ItemDescPropValues) => Promise<ISubItem[]> = getSubItemsSetParams(appid, itemType);
      const giveItemsPrice: (
        item: IItemPropertyDescription
      ) => Promise<IItemPropertyDescription> = giveItemsPriceSetParams(appid, country, currency);
      const { results, errors } = await parallel<ItemDescPropValues, ISubItem>(itemInfo.descriptions, getSubItems, {
        streams: 3,
        timeout: 600
      });
      itemInfo.descriptions.forEach(item => (item.subitems = results.filter(el => el.name.includes(item.value))));

      console.log(JSON.stringify(itemInfo.descriptions));
      console.log(JSON.stringify(results));
      // for (let item of itemInfo.descriptions) {
      //   item.subitems = await getSubItems(item);
      //   await giveItemsPrice(item);
      //   console.log(`[${counter++}/${itemInfo.descriptions.length}] - ${item.value}`);
      //   await sleep(2000);
      // }
      // console.log(JSON.stringify(itemInfo));
    }
  }
};

main();
