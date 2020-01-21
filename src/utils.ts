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
import { countryInfoArray, itemTypes, SUB_ITEMS_URL, PRICE_OVERVIEW_URL } from './constants';

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
        cursor: pointer;
        position: relative;
      }
      .select__arrow-stp {
        position: absolute;
        top: 0;
        right: 0;
        width: 15px;
        height: 15px;
      }
      .select.active-stp .select__arrow-stp {
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
      .select.active-stp .select__options-stp {
        display: block;
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
  addScripts();
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
): Promise<void> => {
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
          item.subitems = [...html.querySelectorAll('#searchResultsRows a')]
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
            .filter(el => el.name);
        }
        case 'capsule':
      }
    }
  }
  item.subitems = [];
};

const addPriceForSubItemsSetParams = (appid: string, country: CountryCode, currency: Currency) => async (
  subItem: ISubItem
): Promise<void> => {
  const price: IPrice | IPriceError = await doReq(
    PRICE_OVERVIEW_URL(appid, country, currency, subItem.market_hash_name)
  ).then(r => r.data);
  if (price.success) subItem.price = price?.lowest_price || '';
  else subItem.price = '';
};

export const giveItemsPriceSetParams = (appid: string, country: CountryCode, currency: Currency) => async (
  item: IItemPropertyDescription
): Promise<void> => {
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
    const market_hash_name: string = html.querySelector('div[data-hash-name]')?.getAttribute('data-hash-name') || '';
    const price: IPrice | IPriceError = await doReq(
      PRICE_OVERVIEW_URL(appid, country, currency, market_hash_name)
    ).then(r => r.data);

    if (price.success) item.price = price?.lowest_price || '';
    else item.price = '';
  }
};
