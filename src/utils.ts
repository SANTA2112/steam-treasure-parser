import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import './_assets/css/style.css';

import { Groups, PriceValues, PricesPerYear, PricesPerYearArr, TQuantityOfSales, TCurrencyIds } from './types';

import {
  IInit,
  IItemProperties,
  ISubItem,
  IItemPropertyDescription,
  IPriceError,
  IDone,
  IFetcher,
  IFetchError,
  IOptions,
  IItemInfo,
  IResponse,
} from './interfaces';

import { doReq } from './API';
import { BASE_URL, months, ITEM_INFO_URL } from './constants';

const getLastDay = (today: Date) => new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
const getLastWeek = (today: Date) => new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
const getLastMonth = (today: Date) => new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
const getLastYear = (today: Date) => new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

const getPriceIndexByDateSetParams = (prices: PriceValues) => (day: number, month: string, year: number) =>
  prices.findIndex(([priceDate]) => {
    const [monthPrice, dayPrice, yearPrice] = priceDate.split(' ');
    return +dayPrice === day && monthPrice === month && +yearPrice === year;
  });

export const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

export const parallel = async <T, R>(
  /** Массив со входными данными */
  arr: T[],
  /** Функция которая принимает входной элемент, производит с ним действия и возвращает промис */
  fetcher: IFetcher<T, R>,
  { streams = 10, timeout = 1000 }: IOptions = {}
): Promise<IDone<T, R>> => {
  const source: T[] = [...arr];
  const results: R[] = [];
  const errors: IFetchError<T>[] = [];
  const tasks: Promise<any>[] = [];

  const wait = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

  const run = async (): Promise<any> => {
    if (source.length === 0) return;
    const current = source.shift() as T;

    return fetcher(current)
      .then((result) => {
        Array.isArray(result) ? results.push(...result) : results.push(result);
      })
      .catch((err: Error) => errors.push({ src: current, message: err.message }))
      .then((_) => wait(timeout))
      .then(run);
  };

  for (let i = 0; i < streams; i++) tasks.push(run());

  await Promise.all(tasks);

  return {
    results,
    errors,
  };
};

const addScripts = (): void => {
  const selects: HTMLDivElement[] = [...document.querySelectorAll('.select-stp')] as HTMLDivElement[];
  selects.forEach((select) => (select.onclick = () => select.classList.toggle('active')));
};

const findPattern = (text: string, reg: string) => {
  const regex: RegExp = new RegExp(reg);
  const matchRes: RegExpMatchArray | null = text.match(regex);
  return matchRes && matchRes[1];
};

export const init = (): IInit => {
  const parsedString: RegExpMatchArray = window.location.href.match(
    /https?:\/\/steamcommunity.com\/market\/listings\/(?<appid>\d+)\/(?<market_hash_name>[\w\%\-\.\'\(\)]+)/
  )!;
  const { appid, market_hash_name } = parsedString.groups as Groups;

  let language = 'english';
  let country: string = 'US';
  let currency: TCurrencyIds = 1;

  const scripts = [...document.querySelectorAll('script')];

  for (let script of scripts) {
    const matchRes = findPattern(script.outerHTML, 'g_strLanguage = "(.+?)"');
    const matchRes2 = findPattern(script.outerHTML, '"wallet_country":"(.+?)"');
    const matchRes3 = findPattern(script.outerHTML, '"wallet_currency":(\\d+?)');
    if (matchRes !== null) language = matchRes;
    if (matchRes2 !== null) country = matchRes2;
    if (matchRes3 !== null) currency = +matchRes3 as TCurrencyIds;
  }

  return { appid, market_hash_name, currency, language, country };
};

export const getItemInfo = (
  appid: string,
  itemName: string,
  count: number = 1
): Promise<IResponse<IItemInfo | IPriceError>> => doReq(ITEM_INFO_URL(appid, itemName, count));

export const findItemsInTreause = (appid: string, items: IItemProperties): IItemPropertyDescription[] => {
  switch (appid) {
    case '570': {
      return items.descriptions.filter(
        (el) =>
          ['b0c3d9', '5e98d9', '4b69ff', '8847ff', 'd32ce6', 'eb4b4b', 'e4ae39'].includes(
            ('color' in el && el.color) || ''
          ) &&
          !(el.value.includes('The International') || el.value.includes('Battle Pass Levels')) &&
          !el.value.includes('/') &&
          !el.value.includes('.')
      );
    }
    case '730': {
      return items.descriptions.filter((el) =>
        ['b0c3d9', '5e98d9', '4b69ff', '8847ff', 'd32ce6', 'eb4b4b'].includes(('color' in el && el.color) || '')
      );
    }
    case '440': {
      return items.descriptions.filter((el) =>
        ['6f6a63', 'b0c3d9', '5e98d9', '4b69ff', '8847ff', 'd32ce6', 'eb4b4b'].includes(
          ('color' in el && el.color) || ''
        )
      );
    }
  }
  return [];
};

const createItem = (appid: string, pricePrefix: string, item: IItemPropertyDescription): void => {
  if (item.subitems.length !== 0) {
    const container: HTMLDivElement = document.createElement('div');

    container.classList.add('select-stp');
    container.innerHTML = `
    <svg class="select__arrow-stp" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z" class=""></path></svg>
    <div class="select__label-stp" style="color: #${item.color}">${item.value}</div>
    <div class="select__options-stp">
      ${item.subitems
        .map(
          (el) => `
        <div class="item__container-stp">
          <div class="item__image-container-stp">
            <img
              class="item__image-stp"
              src="${el.image}"
            />
          </div>
          <a
            class="item-stp"
            href="${BASE_URL}/listings/${appid}/${el.market_hash_name}"
            target="_blank"
            style="color: #${item.color}"
          >${el.name}<span class="item__price-stp">${pricePrefix} ${el.price}</span></a
          >
        </div>
      `
        )
        .join('')}
    </div>
    `;
    item.domNode = container;
  } else {
    const container: HTMLDivElement = document.createElement('div');

    container.classList.add('item__container-stp');
    container.innerHTML = `
      <div class="item__image-container-stp">
        <img
          class="item__image-stp"
          src="${item.image}"
        />
      </div>
      <a
        class="item-stp"
        href="${BASE_URL}/listings/${appid}/${item.market_hash_name}"
        target="_blank"
        style="color: #${item.color}"
      >${item.value}<span class="item__price-stp">${pricePrefix} ${item.price}</span></a
      >
    `;
    item.domNode = container;
  }
};

const render = (item: IItemPropertyDescription) => {
  const divItems: Element[] = [...document.querySelectorAll('#largeiteminfo_item_descriptors .descriptor[style]')];
  const spanItems: Element[] = [...document.querySelectorAll('#largeiteminfo_item_descriptors span[style]')];
  const htmlItems: Element[] = divItems.length !== 0 ? divItems : spanItems.length !== 0 ? spanItems : [];
  const htmlItem: HTMLDivElement = htmlItems.find((el) =>
    el?.textContent?.startsWith(item.value.trim())
  ) as HTMLDivElement;
  htmlItem?.parentElement?.replaceChild(item.domNode, htmlItem);
};

const getSubItemsAndPrice = async (appid: string, item: IItemPropertyDescription): Promise<ISubItem[]> => {
  switch (appid) {
    case '730':
    case '440':
      return getItemInfo(appid, item.value, 100).then((r) =>
        r.data.success
          ? r.data.results
              .filter((subItem) => subItem.name.includes(item.value))
              .sort((a, b) => {
                if (a.sell_price > b.sell_price) return 1;
                if (a.sell_price < b.sell_price) return -1;
                return 0;
              })
              .map((subItem) => ({
                name: subItem.name,
                market_hash_name: subItem.hash_name,
                price: subItem.sale_price_text,
                image: `https://community.akamai.steamstatic.com/economy/image/${subItem.asset_description.icon_url}`,
              }))
          : []
      );
  }
  return [];
};

export const giveItemsPriceSetParams = (appid: string, pricePrefix: string) => async (
  item: IItemPropertyDescription
): Promise<void> => {
  toastr.info(`Getting price for: ${item.value}`);
  item.subitems = await getSubItemsAndPrice(appid, item);

  if (item.subitems.length === 0) {
    const itemInfo = await getItemInfo(appid, item.value).then((r) => r.data);
    if (itemInfo.success) {
      item.image = `https://community.akamai.steamstatic.com/economy/image/${itemInfo.results[0].asset_description.icon_url}`;
      item.price = itemInfo.results[0].sale_price_text;
      item.market_hash_name = itemInfo.results[0].hash_name;
    }
  }

  createItem(appid, pricePrefix, item);
  render(item);
  addScripts();
};

export const getAveragePricePerYear = (prices: PriceValues): PricesPerYear => {
  const objectWithArrayOfPricesByYear = prices.reduce((acc, [priceDate, price, _]) => {
    const year = priceDate.split(' ')[2];
    return Object.keys(acc).includes(year) ? (acc[year].push(price), acc) : { ...acc, [year]: [price] };
  }, {} as PricesPerYearArr);
  const avgPricesPerYear = Object.entries(objectWithArrayOfPricesByYear).reduce(
    (acc, [year, values]) => ({
      ...acc,
      [year]: values.reduce((a, c, i, arr) => (i !== arr.length - 1 ? a + c : +((a + c) / arr.length).toFixed(2)), 0),
    }),
    {} as PricesPerYear
  );
  return avgPricesPerYear;
};

export const renderAveragePricePerYear = (
  pricePrefix: string,
  priceSuffix: string,
  prices: PricesPerYear,
  itemNode: Element | null
): void => {
  const container: HTMLDivElement = document.createElement('div');

  container.classList.add('select-stp');
  container.innerHTML = `
    <svg class="select__arrow-stp" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z" class=""></path></svg>
    <div class="select__label-stp" style="color: #ffffff">Prices per year</div>
    <div class="select__options-stp">
      ${Object.entries(prices)
        .map(
          ([year, price]) => `
        <div class="item__container-stp">
          <div
            class="item-stp"
            style="color: #ffffff"
          >${year}: <span class="item__price-stp">${pricePrefix} ${price} ${priceSuffix}</span></div
          >
        </div>
      `
        )
        .join('')}
    </div>
    `;
  itemNode?.insertAdjacentElement('beforeend', container);
  addScripts();
};

export const getQuantityOfSales = (prices: PriceValues): TQuantityOfSales => {
  const tempDate = new Date();
  const date = new Date(
    tempDate.getUTCFullYear(),
    tempDate.getUTCMonth(),
    tempDate.getUTCDate(),
    tempDate.getUTCHours(),
    tempDate.getUTCMinutes(),
    tempDate.getUTCSeconds()
  );

  const getPriceIndexByDate = getPriceIndexByDateSetParams(prices);

  const [salesPerDay, salesPerWeek, salesPerMonth, salesPerYear] = [
    getLastDay(date),
    getLastWeek(date),
    getLastMonth(date),
    getLastYear(date),
  ]
    .map((neededDate) =>
      getPriceIndexByDate(neededDate.getDate(), months[neededDate.getMonth()], neededDate.getFullYear())
    )
    .map((index) =>
      [...prices]
        .slice(index !== -1 ? index : 0)
        .map(([, , quantity]) => +quantity)
        .reduce((a, c) => a + c, 0)
    );

  return {
    day: salesPerDay > salesPerWeek ? 0 : salesPerDay,
    week: salesPerWeek > salesPerMonth ? 0 : salesPerWeek,
    month: salesPerMonth,
    year: salesPerYear,
  };
};

export const renderQuantityOfSales = (prices: TQuantityOfSales, itemNode: Element | null) => {
  const container: HTMLDivElement = document.createElement('div');

  container.classList.add('select-stp');
  container.innerHTML = `
    <svg class="select__arrow-stp" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z" class=""></path></svg>
    <div class="select__label-stp" style="color: #ffffff">Sales per day, week, month, year</div>
    <div class="select__options-stp">
      ${Object.entries(prices)
        .map(
          ([typeOfTime, quantity]) => `
        <div class="item__container-stp">
          <div
            class="item-stp"
            style="color: #ffffff"
          >${typeOfTime}: <span class="item__price-stp">${quantity}</span></div
          >
        </div>
      `
        )
        .join('')}
    </div>
    `;
  itemNode?.insertAdjacentElement('beforeend', container);
  addScripts();
};
