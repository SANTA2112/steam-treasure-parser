import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import './_assets/css/style.css';

import {
  IPriceError,
  IItemTypeResponce,
  IResponse,
  IItemProperties,
  IItemPropertyDescription,
  IItemInfo,
  priceByQuarters,
} from './interfaces';

import { TQuantityOfSales } from './types';

import { doReq } from './api';

import { ITEM_INFO_URL, ITEM_TYPE_URL, toastrOptions } from './constants';
import { getQuantityOfSales } from './utils/dates';
import { init } from './utils/init';
import { renderQuantityOfSales, findItemsInTreause, giveItemsPriceSetParams } from './utils/items';
import { parallel } from './utils/parallel';
import { getAveragePricePerQuarters, renderAveragePricePerQuarters } from './utils/prices';

toastr.options = toastrOptions;

const main = async () => {
  const { appid, currency, market_hash_name, language, country, prices } = await init();

  const itemPrice: IResponse<IItemInfo | IPriceError> = await doReq(ITEM_INFO_URL(appid, market_hash_name, 1));

  let pricePrefix;
  let priceSuffix;
  const itemPriceHistroryScript: HTMLScriptElement | undefined = [...document.querySelectorAll('script')].find(
    (script) => script.textContent?.includes('var line1='),
  );

  if (itemPriceHistroryScript) {
    pricePrefix = decodeURIComponent(
      itemPriceHistroryScript.textContent?.match(/var strFormatPrefix = "(.+?)";/)?.[1] || '',
    );
    priceSuffix = decodeURIComponent(
      itemPriceHistroryScript.textContent?.match(/var strFormatSuffix = "(.+?)";/)?.[1] || '',
    );
  }

  const itemTypeInfo: IResponse<IItemTypeResponce | IPriceError> = await doReq(
    ITEM_TYPE_URL(appid, language, currency, market_hash_name),
  );

  const itemNode = document.querySelector<HTMLDivElement>('#largeiteminfo_item_name');

  if (itemPrice.data.success && itemTypeInfo.data.success && itemNode) {
    const averagePricePerQuarters: priceByQuarters = getAveragePricePerQuarters(prices);
    const quantityOfSales: TQuantityOfSales = getQuantityOfSales(prices);
    const itemInfo: IItemProperties =
      itemTypeInfo.data.assets[appid][Object.keys(itemTypeInfo.data.assets[appid])[0]][
        Object.keys(itemTypeInfo.data.assets[appid][Object.keys(itemTypeInfo.data.assets[appid])[0]])[0]
      ];

    itemNode.insertAdjacentHTML('beforeend', `<div>Price: ${itemPrice.data.results[0].sell_price_text}</div>`);
    renderAveragePricePerQuarters(averagePricePerQuarters, itemNode, pricePrefix, priceSuffix);
    renderQuantityOfSales(quantityOfSales, itemNode);

    itemInfo.descriptions = findItemsInTreause(appid, itemInfo);

    if (itemInfo.descriptions.length !== 0) {
      const giveItemsPrice: (item: IItemPropertyDescription) => Promise<void> = giveItemsPriceSetParams(
        appid,
        pricePrefix,
      );
      await parallel<IItemPropertyDescription, void>(itemInfo.descriptions, giveItemsPrice, {
        streams: 2,
        timeout: 100,
      });
    }
  }
};

main();
