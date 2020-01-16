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
  CS = 'CS',
  DA = 'DA',
  DE = 'DE',
  EL = 'EL',
  EN = 'EN',
  ES = 'ES',
  FI = 'FI',
  FR = 'FR',
  HU = 'HU',
  IT = 'IT',
  JA = 'JA',
  KO = 'KO',
  NL = 'NL',
  NO = 'NO',
  PL = 'PL',
  PT = 'PT',
  RO = 'RO',
  RU = 'RU',
  SV = 'SV',
  TH = 'TH',
  TR = 'TR',
  UK = 'UK',
  VI = 'VI',
  ZH = 'ZH'
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
  appid: string;
  market_hash_name: string;
  currency: Currency;
  language: string;
  country: string;
}
interface CountryInfo {
  language: Languages;
  currency: Currency;
  countryCode: CountryCode;
}

const countryInfoArray: CountryInfo[] = [
  {
    language: Languages.russian,
    currency: Currency.RUB,
    countryCode: CountryCode.RU
  },
  {
    language: Languages.english,
    currency: Currency.USD,
    countryCode: CountryCode.EN
  }
];

const getUserCookie = (): Partial<Cookie> =>
  document.cookie.split('; ').reduce((acc, cur) => ({ ...acc, [cur.split('=')[0]]: cur.split('=')[1] }), {});

export const init = (): Init => {
  const parsedString = window.location.href.match(
    /https?:\/\/steamcommunity.com\/market\/listings\/(?<appid>\d+)\/(?<market_hash_name>.+)\/?/
  )!;
  const { appid, market_hash_name } = parsedString.groups as Groups;

  const languageRaw: string = getUserCookie().Steam_Language || Languages['english'];
  const countryInfo = countryInfoArray.find(el => el.language === languageRaw);

  const language: string = countryInfo?.language || Languages['english'];
  const country: string = countryInfo?.countryCode || CountryCode['EN'];
  const currency: number = countryInfo?.currency || Currency['USD'];
  return { appid, market_hash_name, currency, language, country };
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
