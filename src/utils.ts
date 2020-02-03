import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import './_assets/css/style.css';

import { Currency, Languages, CountryCode } from './enums';
import { Groups, ItemsType, PriceValues, PricesPerYear, PricesPerYearArr } from './types';
import {
  ICookie,
  IInit,
  IItemProperties,
  ISubItem,
  IItemPropertyDescription,
  IPrice,
  IPriceError,
  IDone,
  IFetcher,
  IFetchError,
  IOptions,
  IUserLangInfo,
  ICountryInfo
} from './interfaces';

import { doReq } from './API';
import { countryInfoArray, itemTypes, SUB_ITEMS_URL, PRICE_OVERVIEW_URL, BASE_URL } from './constants';

export const sleep = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms));

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

  const wait = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms));

  const run = async (): Promise<any> => {
    if (source.length === 0) return;
    const current = source.shift() as T;

    return fetcher(current)
      .then(result => {
        Array.isArray(result) ? results.push(...result) : results.push(result);
      })
      .catch((err: Error) => errors.push({ src: current, message: err.message }))
      .then(_ => wait(timeout))
      .then(run);
  };

  for (let i = 0; i < streams; i++) tasks.push(run());

  await Promise.all(tasks);

  return {
    results,
    errors
  };
};

const getUserICookie = (): Partial<ICookie> =>
  document.cookie.split('; ').reduce((acc, cur) => ({ ...acc, [cur.split('=')[0]]: cur.split('=')[1] }), {});

const addScripts = (): void => {
  const selects: HTMLDivElement[] = [...document.querySelectorAll('.select-stp')] as HTMLDivElement[];
  selects.forEach(select => (select.onclick = () => select.classList.toggle('active')));
};

export const init = (): IInit => {
  const parsedString: RegExpMatchArray = window.location.href.match(
    /https?:\/\/steamcommunity.com\/market\/listings\/(?<appid>\d+)\/(?<market_hash_name>[\w\%\-]+)/
  )!;
  const { appid, market_hash_name } = parsedString.groups as Groups;
  const userLangInfo: IUserLangInfo = {
    language: getUserICookie().Steam_Language,
    countryCode: decodeURIComponent(getUserICookie().steamCountry || '').split('|')[0] || CountryCode.EN
  };
  let countryInfo: ICountryInfo | undefined = countryInfoArray.find(el => el.language === userLangInfo.language);
  if (!countryInfo) countryInfo = countryInfoArray.find(el => el.countryCode === userLangInfo.countryCode);

  const language: Languages = countryInfo?.language || Languages.english;
  const country: CountryCode = countryInfo?.countryCode || CountryCode.EN;
  const currency: Currency = countryInfo?.currency || Currency.USD;
  return { appid, market_hash_name, currency, language, country };
};

export const getAveragePricePerYear = (prices: PriceValues): PricesPerYear => {
  const objectWithArrayOfPricesByYear = prices.reduce((acc, [priceDate, price, _]) => {
    const year = priceDate.split(' ')[2];
    return Object.keys(acc).includes(year) ? (acc[year].push(price), acc) : { ...acc, [year]: [price] };
  }, {} as PricesPerYearArr);
  const avgPricesPerYear = Object.entries(objectWithArrayOfPricesByYear).reduce(
    (acc, [year, values]) => ({
      ...acc,
      [year]: values.reduce((a, c, i, arr) => (i !== arr.length - 1 ? a + c : +((a + c) / arr.length).toFixed(2)), 0)
    }),
    {} as PricesPerYear
  );
  return avgPricesPerYear;
};

export const getItemType = (item: IItemProperties): ItemsType | void =>
  item.descriptions && itemTypes.find(type => item.market_hash_name.toLowerCase().includes(type));

export const findItemsInTreause = (
  appid: string,
  treasureType: ItemsType,
  items: IItemProperties
): IItemPropertyDescription[] => {
  switch (appid) {
    case '570': {
      switch (treasureType) {
        case 'trove carafe':
        case 'treasure': {
          return items.descriptions.filter(
            el =>
              ['b0c3d9', '5e98d9', '4b69ff', '8847ff', 'd32ce6', 'eb4b4b', 'e4ae39'].includes(
                ('color' in el && el.color) || ''
              ) &&
              !(el.value.includes('The International') || el.value.includes('Battle Pass Levels')) &&
              !el.value.includes('/') &&
              !el.value.includes('.')
          );
        }
      }
    }
    case '730': {
      switch (treasureType) {
        case 'case':
        case 'container':
        case 'souvenir package':
        case 'holo-foil':
        case 'capsule': {
          return items.descriptions.filter(el =>
            ['b0c3d9', '5e98d9', '4b69ff', '8847ff', 'd32ce6', 'eb4b4b'].includes(('color' in el && el.color) || '')
          );
        }
      }
    }
    case '440': {
      switch (treasureType) {
        case 'case':
        case 'crate': {
          return items.descriptions.filter(el =>
            ['6f6a63', 'b0c3d9', '5e98d9', '4b69ff', '8847ff', 'd32ce6', 'eb4b4b'].includes(
              ('color' in el && el.color) || ''
            )
          );
        }
      }
    }
    case '218620': {
      switch (treasureType) {
        case 'safe':
          return [...new DOMParser().parseFromString(items.descriptions[0].value, 'text/html').querySelectorAll('span')]
            .map(el => ({
              value: el.textContent?.trim() || '',
              color:
                el
                  .getAttribute('style')
                  ?.split(' ')[1]
                  .replace('#', '') || undefined,
              subitems: [],
              price: '',
              domNode: document.createElement('div'),
              img: '',
              market_hash_name: ''
            }))
            .filter(
              el =>
                ['2360D8', '9900FF', 'FF00FF', 'FF0000', 'FFAA00'].includes(('color' in el && el.color) || '') &&
                el.value.includes(' | ')
            );
      }
    }
  }
  return [];
};

const findSubItemsInHTML = async (
  itemName: string,
  treasureType: ItemsType,
  itemColor1: string,
  itemColor2?: string
): Promise<ISubItem[]> => {
  const parser: DOMParser = new DOMParser();
  const html: Document = parser.parseFromString(
    await doReq(`${SUB_ITEMS_URL}${itemName}`).then(r => r.data),
    'text/html'
  );
  return [...html.querySelectorAll('#searchResultsRows a')]
    .map(el => {
      const name =
        treasureType !== 'souvenir package'
          ? (
              (itemColor2 && el.querySelector(`span[style="color: ${itemColor2};"]`)) ||
              el.querySelector(`span[style="color: ${itemColor1};"]`)
            )?.textContent
          : el.querySelector('span[style="color: #FFD700;"]')?.textContent;
      return {
        name: name?.includes(itemName) ? name : '',
        market_hash_name: el.querySelector('div[data-hash-name]')?.getAttribute('data-hash-name') || '',
        img: el.querySelector('img')?.src || ''
      };
    })
    .filter(el => el.name);
};

export const getSubItemsSetParams = (appid: string, treasureType: ItemsType) => async (
  item: IItemPropertyDescription
): Promise<ISubItem[]> => {
  switch (appid) {
    case '730': {
      switch (treasureType) {
        case 'case':
        case 'container':
        case 'souvenir package':
          return (item.subitems = await findSubItemsInHTML(item.value, treasureType, '#D2D2D2', '#CF6A32'));
        case 'capsule':
      }
    }
    case '440': {
      switch (treasureType) {
        case 'case':
        case 'crate':
          return (item.subitems = await findSubItemsInHTML(item.value, treasureType, '#FAFAFA', '#CF6A32'));
      }
    }
    case '218620': {
      switch (treasureType) {
        case 'safe':
          return (item.subitems = await findSubItemsInHTML(item.value, treasureType, `#${item?.color}`));
      }
    }
  }
  return (item.subitems = []);
};

const addPriceForSubItemsSetParams = (appid: string, country: CountryCode, currency: Currency) => async (
  subItem: ISubItem
): Promise<void> => {
  toastr.info(`Getting price for: ${subItem.name}`);
  const price: IPrice | IPriceError = await doReq(
    PRICE_OVERVIEW_URL(appid, country, currency, subItem.market_hash_name)
  ).then(r => r.data);
  if (price.success) subItem.price = price?.lowest_price || '';
  else subItem.price = '';
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
          el => `
        <div class="item__container-stp">
          <div class="item__image-container-stp">
            <img
              class="item__image-stp"
              src="${el.img}"
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
          src="${item.img}"
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
  const htmlItem: HTMLDivElement = htmlItems.find(el =>
    el?.textContent?.startsWith(item.value.trim())
  ) as HTMLDivElement;
  htmlItem?.parentElement?.replaceChild(item.domNode, htmlItem);
};

export const giveItemsPriceSetParams = (
  appid: string,
  country: CountryCode,
  currency: Currency,
  pricePrefix: string
) => async (item: IItemPropertyDescription): Promise<void> => {
  toastr.info(`Getting price for: ${item.value}`);
  if (item.subitems.length !== 0) {
    const addPriceForSubItems: (subItem: ISubItem) => Promise<void> = addPriceForSubItemsSetParams(
      appid,
      country,
      currency
    );
    await parallel<ISubItem, void>(item.subitems, addPriceForSubItems, { streams: 1, timeout: 3000 });
  } else {
    const parser: DOMParser = new DOMParser();
    const html: Document = parser.parseFromString(
      await doReq(`${SUB_ITEMS_URL}${item.value}`).then(r => r.data),
      'text/html'
    );
    const itemHTMLNode: Element | null = html.querySelector('#searchResultsRows a');
    const market_hash_name: string =
      itemHTMLNode?.querySelector('div[data-hash-name]')?.getAttribute('data-hash-name') || '';
    item.img = itemHTMLNode?.querySelector('img')?.src || '';
    item.market_hash_name = market_hash_name;

    const price: IPrice | IPriceError = await doReq(
      PRICE_OVERVIEW_URL(appid, country, currency, market_hash_name)
    ).then(r => r.data);

    if (price.success) item.price = price?.lowest_price || '';
    else item.price = '';
  }
  createItem(appid, pricePrefix, item);
  render(item);
  addScripts();
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
