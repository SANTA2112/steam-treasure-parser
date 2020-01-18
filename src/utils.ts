export enum Currency {
  USD = 1,
  GBP,
  EUR,
  CHF,
  RUB,
  PLN,
  BRL,
  JPY,
  NOK,
  IDR,
  MYR,
  PHP,
  SGD,
  THB,
  VND,
  KRW,
  TRY,
  UAH,
  MXN,
  CAD,
  AUD,
  NZD,
  CNY,
  INR,
  CLP,
  PEN,
  COP,
  ZAR,
  HKD,
  TWD,
  SAR,
  AED,
  ARS = 34,
  ILS,
  KZT = 37,
  KWD,
  QAR,
  CRC,
  UYU
}

export enum Languages {
  brazilian = 'brazilian',
  bulgarian = 'bulgarian',
  czech = 'czech',
  danish = 'danish',
  dutch = 'dutch',
  english = 'english',
  finnish = 'finnish',
  french = 'french',
  german = 'german',
  greek = 'greek',
  hungarian = 'hungarian',
  italian = 'italian',
  japanese = 'japanese',
  koreana = 'koreana',
  latam = 'latam',
  norwegian = 'norwegian',
  polish = 'polish',
  portuguese = 'portuguese',
  romanian = 'romanian',
  russian = 'russian',
  schinese = 'schinese',
  spanish = 'spanish',
  swedish = 'swedish',
  tchinese = 'tchinese',
  thai = 'thai',
  turkish = 'turkish',
  ukrainian = 'ukrainian',
  vietnamese = 'vietnamese'
}

export enum CountryCode {
  BG = 'BG',
  BR = 'BR',
  CN = 'CN',
  CZ = 'CZ',
  DE = 'DE',
  DK = 'DK',
  EN = 'EN',
  ES = 'ES',
  FI = 'FI',
  FR = 'FR',
  GR = 'GR',
  HU = 'HU',
  IT = 'IT',
  JP = 'JP',
  KR = 'KR',
  NL = 'NL',
  NO = 'NO',
  PL = 'PL',
  PT = 'PT',
  RO = 'RO',
  RU = 'RU',
  SE = 'SE',
  TH = 'TH',
  TR = 'TR',
  TW = 'TW',
  UA = 'UA',
  VN = 'VN'
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

type PriceValues = [string, number, string][];
type ItemsType = 'case' | 'treasure' | 'container' | 'souvenir package';

type ICookie = {
  browserid: string;
  timezoneOffset: string;
  steamCountry: string;
  recentapps: string;
  sessionid: string;
  app_impressions: string;
  Steam_Language: string;
};
interface IInit {
  appid: string;
  market_hash_name: string;
  currency: Currency;
  language: Languages;
  country: CountryCode;
}
interface ICountryInfo {
  language: Languages;
  currency: Currency;
  countryCode: CountryCode;
}
export interface IItemProperties {
  descriptions?: {
    value: string;
    color?: string;
    type?: string;
  }[];
  name: string;
  type: string;
}

export type ItemDescPropValues = {
  value: string;
  color?: string;
  type?: string;
};

const countryInfoArray: ICountryInfo[] = [
  {
    language: Languages.brazilian,
    currency: Currency.BRL,
    countryCode: CountryCode.BR
  },
  {
    language: Languages.bulgarian,
    currency: Currency.USD,
    countryCode: CountryCode.BG
  },
  {
    language: Languages.czech,
    currency: Currency.USD,
    countryCode: CountryCode.CZ
  },
  {
    language: Languages.danish,
    currency: Currency.USD,
    countryCode: CountryCode.DK
  },
  {
    language: Languages.dutch,
    currency: Currency.EUR,
    countryCode: CountryCode.NL
  },
  {
    language: Languages.english,
    currency: Currency.USD,
    countryCode: CountryCode.EN
  },
  {
    language: Languages.finnish,
    currency: Currency.USD,
    countryCode: CountryCode.FI
  },
  {
    language: Languages.french,
    currency: Currency.USD,
    countryCode: CountryCode.FR
  },
  {
    language: Languages.german,
    currency: Currency.USD,
    countryCode: CountryCode.DE
  },
  {
    language: Languages.greek,
    currency: Currency.USD,
    countryCode: CountryCode.GR
  },
  {
    language: Languages.hungarian,
    currency: Currency.USD,
    countryCode: CountryCode.HU
  },
  {
    language: Languages.italian,
    currency: Currency.USD,
    countryCode: CountryCode.IT
  },
  {
    language: Languages.japanese,
    currency: Currency.JPY,
    countryCode: CountryCode.JP
  },
  {
    language: Languages.koreana,
    currency: Currency.KRW,
    countryCode: CountryCode.KR
  },
  {
    language: Languages.latam,
    currency: Currency.USD,
    countryCode: CountryCode.ES
  },
  {
    language: Languages.norwegian,
    currency: Currency.NOK,
    countryCode: CountryCode.NO
  },
  {
    language: Languages.polish,
    currency: Currency.PLN,
    countryCode: CountryCode.PL
  },
  {
    language: Languages.portuguese,
    currency: Currency.USD,
    countryCode: CountryCode.PT
  },
  {
    language: Languages.romanian,
    currency: Currency.USD,
    countryCode: CountryCode.RO
  },
  {
    language: Languages.russian,
    currency: Currency.RUB,
    countryCode: CountryCode.RU
  },
  {
    language: Languages.schinese,
    currency: Currency.CNY,
    countryCode: CountryCode.CN
  },
  {
    language: Languages.spanish,
    currency: Currency.USD,
    countryCode: CountryCode.ES
  },
  {
    language: Languages.swedish,
    currency: Currency.CHF,
    countryCode: CountryCode.SE
  },
  {
    language: Languages.tchinese,
    currency: Currency.CNY,
    countryCode: CountryCode.TW
  },
  {
    language: Languages.thai,
    currency: Currency.THB,
    countryCode: CountryCode.TH
  },
  {
    language: Languages.turkish,
    currency: Currency.TRY,
    countryCode: CountryCode.TR
  },
  {
    language: Languages.ukrainian,
    currency: Currency.UAH,
    countryCode: CountryCode.UA
  },
  {
    language: Languages.vietnamese,
    currency: Currency.VND,
    countryCode: CountryCode.VN
  }
];

const itemTypes: ItemsType[] = ['souvenir package', 'case', 'container', 'treasure'];

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
