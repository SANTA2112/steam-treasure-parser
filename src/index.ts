import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import './_assets/css/style.css';

import { type Description, type IInit, type QueryData } from './interfaces';

import { currencyAssotiations, toastrOptions } from './constants';
import { getQuantityOfSales } from './utils/dates';
import { init } from './utils/init';
import { renderQuantityOfSales, findItemsInTreause, giveItemsPricesSetParams, findSubItemOnPage } from './utils/items';
import { type ErrorHandlerArg, parallel, waitFor } from './utils/parallel';
import {
  getAveragePricePerQuarters,
  makePrice,
  renderAveragePricePerQuarters,
  renderPriceValue,
  renderSalesRangeSlider,
  renderWrapper,
} from './utils/prices';
import { addRangeSliderScript, addSelectListener, addTabsScript, waitForSelector } from './utils/common';

toastr.options = toastrOptions;

const errorHandler = (args: ErrorHandlerArg<Description>) => {
  const { error, item } = args;
  console.log(`FAIL ${item.value} - (${error.message})`);
};

const main = async (queryData?: QueryData) => {
  const { appid, currency, descriptions, itemBuyPrice, itemSellPrice, prices } = init(queryData);

  await waitFor(100);
  const itemNode = await waitForSelector<HTMLHeadingElement>('h2[style^="--text-weight:"]');

  if (itemNode) {
    const wrapper = renderWrapper(itemNode);
    const averagePricePerQuarters = getAveragePricePerQuarters(prices);
    const quantityOfSales = getQuantityOfSales(prices);
    const priceSuffix = currencyAssotiations[currency];
    renderPriceValue(wrapper, Number(itemSellPrice), priceSuffix, 'sell');
    renderPriceValue(wrapper, Number(itemBuyPrice), priceSuffix, 'buy');
    renderQuantityOfSales(quantityOfSales, wrapper);
    renderAveragePricePerQuarters(averagePricePerQuarters, wrapper, priceSuffix);
    renderSalesRangeSlider(wrapper);
    addRangeSliderScript(prices);
    addTabsScript();

    const itemsInTreasure = findItemsInTreause(appid, descriptions)
      .map((el) => ({ ...el, value: el.value.trim() }))
      .filter((item) => findSubItemOnPage(item.value));

    if (itemsInTreasure.length > 1) {
      const giveItemsPrice = giveItemsPricesSetParams(appid);
      await parallel<Description, void>(itemsInTreasure, {
        handler: giveItemsPrice,
        concurrency: Math.max(1, Math.floor(itemsInTreasure.length / 4)),
        timeout: 100,
        errorHandler,
        needResults: false,
      });
    }
  }
};

addSelectListener();

window.addEventListener('message', async (event) => {
  if (event.source !== window) return;

  const msg = event.data;

  if (msg.type === 'page STP') {
    main();
  }

  if (msg.type === 'lots STP') {
    const itemInfo = (JSON.parse(msg.data) as Record<string, unknown>[]).find((item) => item.queryData);
    if (itemInfo && 'queryData' in itemInfo && typeof itemInfo.queryData === 'string') {
      main(JSON.parse(itemInfo.queryData));
    }
  }

  if (msg.type === 'price STP') {
    const [sellContainer = null, buyContainer = null] = [
      ...document.querySelectorAll<HTMLSpanElement>('span.total-value-stp'),
    ];

    if (!sellContainer || !buyContainer) return;
    const { sellPrice, buyPrice, currency } = msg.data as { sellPrice: number; buyPrice: number; currency: number };
    const priceSuffix = currencyAssotiations[currency.toString() as IInit['currency']];

    sellContainer.textContent = makePrice(sellPrice, priceSuffix);
    buyContainer.textContent = makePrice(buyPrice, priceSuffix);
  }
});
