import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

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
import { countryInfoArray, itemTypes, SUB_ITEMS_URL, PRICE_OVERVIEW_URL, BASE_URL, toastrOptions } from './constants';

toastr.options = toastrOptions;

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

const addStyles = (): void => {
  const elementsStyle: HTMLStyleElement = document.createElement('style');
  elementsStyle.innerHTML = `
      .item__container-stp {
        position: relative;
      }
      .item__container-stp:hover .item__image-container-stp {
        display: block;
      }
      .item__image-container-stp {
        display: none;
        position: absolute;
        top: -50px;
        right: 0;
        transform: translate(10%, 0%);
      }
      .item__image-stp {
        height: 6rem;
      }
      .select-stp {
        user-select: none;
        outline: none;
        position: relative;
      }
      .select__arrow-stp {
        position: absolute;
        top: 0;
        right: 0;
        width: 15px;
        height: 15px;
      }
      .select-stp.active .select__arrow-stp {
        transform: rotate(180deg);
      }
      .select__option-stp {
        opacity: .6;
        transition: opacity .1s;
        will-change: opacity;
      }
      .select__option-stp:hover {
        opacity: 1;
      }
      .select__options-stp {
        display: none;
      }
      .select-stp.active .select__options-stp {
        display: block;
      }
      .item__price-stp {
        color: #2fff00;
      }
      .select__label-stp {
        cursor: pointer;
      }
    `;
  document.head.appendChild(elementsStyle);
};

const addScripts = (): void => {
  const selects: HTMLDivElement[] = [...document.querySelectorAll('.select-stp')] as HTMLDivElement[];
  selects.forEach(select => (select.onclick = () => select.classList.toggle('active')));
};

export const init = (): IInit => {
  addStyles();
  const parsedString: RegExpMatchArray = window.location.href.match(
    /https?:\/\/steamcommunity.com\/market\/listings\/(?<appid>\d+)\/(?<market_hash_name>.+)\/?/
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
      break;
    }
    case '730': {
      switch (treasureType) {
        case 'case':
        case 'container':
        case 'souvenir package':
        case 'capsule': {
          return items.descriptions.filter(el =>
            ['b0c3d9', '5e98d9', '4b69ff', '8847ff', 'd32ce6', 'eb4b4b'].includes(('color' in el && el.color) || '')
          );
        }
      }
      break;
    }
  }
  return [];
};

export const getSubItemsSetParams = (appid: string, treasureType: ItemsType) => async (
  item: IItemPropertyDescription
): Promise<ISubItem[]> => {
  const parser: DOMParser = new DOMParser();
  switch (appid) {
    case '730': {
      switch (treasureType) {
        case 'case':
        case 'container':
        case 'souvenir package': {
          const html: Document = parser.parseFromString(
            await doReq(`${SUB_ITEMS_URL}${item.value}`).then(r => r.data),
            'text/html'
          );
          return (item.subitems = [...html.querySelectorAll('#searchResultsRows a')]
            .map(el => ({
              name:
                treasureType !== 'souvenir package'
                  ? (
                      el.querySelector('span[style="color: #D2D2D2;"]') ||
                      el.querySelector('span[style="color: #CF6A32;"]')
                    )?.textContent || ''
                  : el.querySelector('span[style="color: #FFD700;"]')?.textContent || '',
              market_hash_name: el.querySelector('div[data-hash-name]')?.getAttribute('data-hash-name') || '',
              img: el.querySelector('img')?.src || ''
            }))
            .filter(el => el.name));
        }
        case 'capsule':
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
        href="${BASE_URL}/listings/${appid}/${item.value}"
        target="_blank"
        style="color: #${item.color}"
      >${item.value}<span class="item__price-stp">${pricePrefix} ${item.price}</span></a
      >
    `;
    item.domNode = container;
  }
};

const render = (item: IItemPropertyDescription) => {
  const htmlItem: HTMLDivElement = [
    ...document.querySelectorAll('#largeiteminfo_item_descriptors .descriptor[style]')
  ].find(el => el?.textContent?.startsWith(item.value)) as HTMLDivElement;
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
    await parallel<ISubItem, void>(item.subitems, addPriceForSubItems, { streams: 1, timeout: 2750 });
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
