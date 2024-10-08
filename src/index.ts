import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import './_assets/css/style.css';

import { IItemPropertyDescription } from './interfaces';

import { toastrOptions } from './constants';
import { getQuantityOfSales } from './utils/dates';
import { init } from './utils/init';
import { renderQuantityOfSales, findItemsInTreause, giveItemsPriceSetParams } from './utils/items';
import { ErrorHandlerArg, parallel } from './utils/parallel';
import {
  getAveragePricePerQuarters,
  renderAveragePricePerQuarters,
  renderPriceValue,
  renderSalesRangeSlider,
  renderWrapper,
} from './utils/prices';
import { fetchItemPrice } from './api';
import { addRangeSliderScript, addTabsScript } from './utils/common';

toastr.options = toastrOptions;

const errorHandler = (args: ErrorHandlerArg<IItemPropertyDescription>) => {
  const { error, item } = args;
  console.log(`FAIL ${item.market_hash_name} - (${error.message})`);
};

const main = async () => {
  const { appid, currency, language, country, prices, item_nameid, item_info, item_price, price_suffix } = init();

  const itemNode = document.querySelector('#largeiteminfo_item_name');

  let itemPriceValue = item_price;
  if (Number.isNaN(item_price)) {
    const itemPriceResponse = await fetchItemPrice(country, language, currency, item_nameid);
    itemPriceValue = Number(itemPriceResponse.lowest_sell_order);
  }

  if (itemNode) {
    const wrapper = renderWrapper(itemNode);
    const averagePricePerQuarters = getAveragePricePerQuarters(prices);
    const quantityOfSales = getQuantityOfSales(prices);
    renderPriceValue(wrapper, Number(itemPriceValue) / 100, price_suffix);
    renderQuantityOfSales(quantityOfSales, wrapper);
    renderAveragePricePerQuarters(averagePricePerQuarters, wrapper, price_suffix);
    renderSalesRangeSlider(wrapper);
    addRangeSliderScript(prices);
    addTabsScript();

    item_info.descriptions = findItemsInTreause(appid, item_info);

    if (item_info.descriptions.length !== 0) {
      const giveItemsPrice = giveItemsPriceSetParams(appid);
      await parallel<IItemPropertyDescription, void>(item_info.descriptions, {
        handler: giveItemsPrice,
        concurrency: 1,
        timeout: 5000,
        errorHandler,
        needResults: false,
      });
    }
  }
};

main();
