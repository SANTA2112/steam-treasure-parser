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
import { ItemsType, PricesPerYear } from './types';

import { doReq } from './API';
import {
  init,
  getAveragePricePerYear,
  findItemsInTreause,
  getItemType,
  getSubItemsSetParams,
  giveItemsPriceSetParams,
  parallel,
  renderAveragePricePerYear
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

  const itemNode: Element | null = document.querySelector('#largeiteminfo_item_name');

  if (itemPrice.data.success && itemPriceHistrory.data.success && itemTypeInfo.data.success) {
    const { prices, price_prefix, price_suffix } = itemPriceHistrory.data;
    const lowestPrice: string = `${price_prefix} ${itemPrice.data?.lowest_price}` || '';
    const averagePricePerYear: PricesPerYear = getAveragePricePerYear(prices);
    const itemInfo: IItemProperties =
      itemTypeInfo.data.assets[appid][2][Object.keys(itemTypeInfo.data.assets[appid][2])[0]];
    const itemType: ItemsType | void = getItemType(itemInfo);
    itemNode?.insertAdjacentHTML('beforeend', `<div>Price: ${lowestPrice}</div>`);
    renderAveragePricePerYear(price_prefix, price_suffix, averagePricePerYear, itemNode);
    if (itemType) {
      itemInfo.descriptions = findItemsInTreause(appid, itemType, itemInfo);
      const getSubItems: (item: IItemPropertyDescription) => Promise<ISubItem[]> = getSubItemsSetParams(
        appid,
        itemType
      );
      const giveItemsPrice: (item: IItemPropertyDescription) => Promise<void> = giveItemsPriceSetParams(
        appid,
        country,
        currency,
        price_prefix
      );

      await parallel<IItemPropertyDescription, ISubItem[]>(itemInfo.descriptions, getSubItems, {
        streams: 3,
        timeout: 600
      });
      await parallel<IItemPropertyDescription, void>(itemInfo.descriptions, giveItemsPrice, {
        streams: 1,
        timeout: 2750
      });
    }
  }
};

main();
