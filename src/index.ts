import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import './_assets/css/style.css';

import { IItemPropertyDescription } from './interfaces';

import { toastrOptions } from './constants';
import { getQuantityOfSales } from './utils/dates';
import { init } from './utils/init';
import { renderQuantityOfSales, findItemsInTreause, giveItemsPriceSetParams } from './utils/items';
import { parallel } from './utils/parallel';
import { getAveragePricePerQuarters, renderAveragePricePerQuarters } from './utils/prices';

toastr.options = toastrOptions;

const main = async () => {
  const {
    appid,
    currency,
    language,
    country,
    prices,
    item_nameid,
    item_info,
    item_price,
    market_hash_name,
    price_suffix,
  } = init();

  const itemNode = document.querySelector<HTMLDivElement>('#largeiteminfo_item_name');

  if (itemNode) {
    const averagePricePerQuarters = getAveragePricePerQuarters(prices);
    const quantityOfSales = getQuantityOfSales(prices);
    itemNode.insertAdjacentHTML('beforeend', `<div>Price: ${Number(item_price) / 100} ${price_suffix}</div>`);
    renderAveragePricePerQuarters(averagePricePerQuarters, itemNode, price_suffix);
    renderQuantityOfSales(quantityOfSales, itemNode);

    item_info.descriptions = findItemsInTreause(appid, item_info);

    if (item_info.descriptions.length !== 0) {
      const giveItemsPrice = giveItemsPriceSetParams(appid);
      await parallel<IItemPropertyDescription, void>(item_info.descriptions, giveItemsPrice, {
        streams: 2,
        timeout: 100,
      });
    }
  }
};

main();
