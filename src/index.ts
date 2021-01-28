import toastr from 'toastr';

import {
  IPriceHistory,
  IPriceError,
  IItemTypeResponce,
  IResponse,
  IItemProperties,
  IItemPropertyDescription,
  IItemInfo,
} from './interfaces';

import { PricesPerYear, TQuantityOfSales } from './types';

import { doReq } from './API';

import {
  init,
  getAveragePricePerYear,
  findItemsInTreause,
  giveItemsPriceSetParams,
  parallel,
  renderAveragePricePerYear,
  getQuantityOfSales,
  renderQuantityOfSales,
} from './utils';

import { PRICE_HISTIRY_URL, ITEM_INFO_URL, ITEM_TYPE_URL, toastrOptions } from './constants';

toastr.options = toastrOptions;

const main = async () => {
  const { appid, currency, market_hash_name, language, country } = init();

  const itemPrice: IResponse<IItemInfo | IPriceError> = await doReq(ITEM_INFO_URL(appid, market_hash_name, 1));

  const itemPriceHistrory: IResponse<IPriceHistory | IPriceError> = await doReq(
    PRICE_HISTIRY_URL(appid, country, currency, market_hash_name)
  );
  const itemTypeInfo: IResponse<IItemTypeResponce | IPriceError> = await doReq(
    ITEM_TYPE_URL(appid, language, currency, market_hash_name)
  );

  const itemNode: Element | null = document.querySelector('#largeiteminfo_item_name');

  if (itemPrice.data.success && itemPriceHistrory.data.success && itemTypeInfo.data.success && itemNode) {
    const { prices, price_prefix, price_suffix } = itemPriceHistrory.data;

    const averagePricePerYear: PricesPerYear = getAveragePricePerYear(prices);
    const quantityOfSales: TQuantityOfSales = getQuantityOfSales(prices);
    const itemInfo: IItemProperties =
      itemTypeInfo.data.assets[appid][Object.keys(itemTypeInfo.data.assets[appid])[0]][
        Object.keys(itemTypeInfo.data.assets[appid][Object.keys(itemTypeInfo.data.assets[appid])[0]])[0]
      ];

    itemNode.insertAdjacentHTML('beforeend', `<div>Price: ${itemPrice.data.results[0].sell_price_text}</div>`);
    renderAveragePricePerYear(price_prefix, price_suffix, averagePricePerYear, itemNode);
    renderQuantityOfSales(quantityOfSales, itemNode);

    itemInfo.descriptions = findItemsInTreause(appid, itemInfo);

    if (itemInfo.descriptions.length !== 0) {
      const giveItemsPrice: (item: IItemPropertyDescription) => Promise<void> = giveItemsPriceSetParams(
        appid,
        price_prefix
      );
      await parallel<IItemPropertyDescription, void>(itemInfo.descriptions, giveItemsPrice, {
        streams: itemInfo.descriptions.length,
        timeout: 100,
      });
    }
  }
};

main();
