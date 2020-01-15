export enum Currency {
  USD,
  PoundSign,
  EUR,
  CHF,
  RUB,
  Zloty,
  BRL,
  YenSign,
  SEK,
  IDR,
  MYR
}

type Groups = {
  [key: string]: string;
};

type PricesPerYearArr = {
  [key: string]: number[];
};

type PricesPerYear = {
  [key: string]: number;
};

type IPriceValues = [string, number, string][];

type Cookie = {
  browserid: string;
  timezoneOffset: string;
  steamCountry: string;
  recentapps: string;
  sessionid: string;
  app_impressions: string;
  Steam_Language: string;
};

interface Init {
  gameID: number;
  itemName: string;
  currency: Currency;
  lng: string;
}

export const init = (): Init => {
  const parsedString = window.location.href.match(
    /https?:\/\/steamcommunity.com\/market\/listings\/(?<gameID>\d+)\/(?<itemName>.+)\/?/
  )!;
  const { gameID, itemName } = parsedString.groups as Groups;
  const lng =
    document.cookie
      .split('; ')
      .reduce((acc, cur) => ({ ...acc, [cur.split('=')[0]]: cur.split('=')[1] }), {} as Partial<Cookie>)
      .Steam_Language === 'english'
      ? 'EN'
      : 'RU';

  const currency = lng === 'EN' ? Currency.USD : Currency.RUB;
  return { gameID: +gameID, itemName, currency, lng };
};

export const getAveragePricePerYear = (prices: IPriceValues): PricesPerYear => {
  const objectWithArrayOfPricesByYear = prices.reduce((acc, [priceDate, price, _]) => {
    const year = priceDate.split(' ')[2];
    if (Object.keys(acc).includes(year)) {
      acc[year].push(price);
      return acc;
    }
    return { ...acc, [year]: [price] };
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
