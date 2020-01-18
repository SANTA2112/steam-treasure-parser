import { Currency, Languages, CountryCode } from './enums';
import { Groups, ItemsType, PriceValues, PricesPerYear, PricesPerYearArr, ItemDescPropValues } from './types';
import { ICookie, IInit, IItemProperties, ISubItem } from './interfaces';

import { doReq } from './API';
import { countryInfoArray, itemTypes, SUB_ITEMS_URL } from './constants';

export const sleep = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms));

const getUserICookie = (): Partial<ICookie> =>
  document.cookie.split('; ').reduce((acc, cur) => ({ ...acc, [cur.split('=')[0]]: cur.split('=')[1] }), {});

export const init = (): IInit => {
  const parsedString = window.location.href.match(
    /https?:\/\/steamcommunity.com\/market\/listings\/(?<appid>\d+)\/(?<market_hash_name>.+)\/?/
  )!;
  const { appid, market_hash_name } = parsedString.groups as Groups;

  const languageRaw: string = getUserICookie().Steam_Language || Languages.english;
  const countryInfo = countryInfoArray.find(el => el.language === languageRaw);

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
  item.descriptions &&
  itemTypes.find(type => item.name.toLowerCase().includes(type) || item.type.toLowerCase().includes(type));

export const findItemsInTreause = (
  appid: string,
  treasureType: ItemsType,
  items: IItemProperties
): ItemDescPropValues[] => {
  switch (appid) {
    case '570': {
      switch (treasureType) {
        case 'treasure': {
          return (
            items.descriptions?.filter(
              el =>
                el.color &&
                el.type === 'html' &&
                !(el.value.includes('The International') || el.value.includes('Battle Pass Levels')) &&
                !el.value.includes('/') &&
                !el.value.includes('On Trade Cooldown Until')
            ) || []
          );
        }
      }
      break;
    }
    case '730': {
      switch (treasureType) {
        case 'case':
        case 'container':
        case 'capsule':
        case 'souvenir package': {
          return (
            items.descriptions?.filter(
              el =>
                el.color &&
                el.type === 'html' &&
                (el.value.includes('|') || (el.value.includes('(') && el.value.includes(')')))
            ) || []
          );
        }
      }
      break;
    }
  }
  return [];
};

export const getSubItemsSetParams = (appid: string, treasureType: ItemsType) => async (
  item: ItemDescPropValues
): Promise<ISubItem[]> => {
  switch (appid) {
    case '730': {
      switch (treasureType) {
        case 'capsule': {
          return [];
        }
        case 'case':
        case 'container':
        case 'souvenir package': {
          if (item.value.toLowerCase().includes('holo') || item.value.toLowerCase().includes('foil')) {
            return [];
          }
          const data: ISubItem[] = [];
          const html: string = await doReq(`${SUB_ITEMS_URL}${item.value}`).then(r => r.data);
          let temp: HTMLDivElement | null = document.createElement('div');
          temp.innerHTML = html;
          const results = [...temp.querySelectorAll('#searchResultsRows a')] as HTMLDivElement[];
          if (results.length !== 0) {
            results.forEach(el =>
              data.push({
                name:
                  treasureType !== 'souvenir package'
                    ? (
                        el.querySelector('span[style="color: #D2D2D2;"]') ||
                        el.querySelector('span[style="color: #CF6A32;"]')
                      )?.textContent || ''
                    : el.querySelector('span[style="color: #FFD700;"]')?.textContent || '',
                img: el.querySelector('img')?.src || '',
                market_hash_name: el.querySelector('div[data-hash-name]')?.getAttribute('data-hash-name') || ''
              })
            );
          }
          await sleep(2000);
          return data.filter(el => el.name);
        }
      }
    }
  }
  return [];
};
