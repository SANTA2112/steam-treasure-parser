export enum Currency {
  USD = 1,
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

export enum Languages {
  schinese = 'schinese',
  tchinese = 'tchinese',
  japanese = 'japanese',
  koreana = 'koreana',
  thai = 'thai',
  bulgarian = 'bulgarian',
  czech = 'czech',
  danish = 'danish',
  german = 'german',
  english = 'english',
  spanish = 'spanish',
  latam = 'latam',
  greek = 'greek',
  french = 'french',
  italian = 'italian',
  hungarian = 'hungarian',
  dutch = 'dutch',
  norwegian = 'norwegian',
  polish = 'polish',
  portuguese = 'portuguese',
  brazilian = 'brazilian',
  romanian = 'romanian',
  russian = 'russian',
  finnish = 'finnish',
  swedish = 'swedish',
  turkish = 'turkish',
  vietnamese = 'vietnamese',
  ukrainian = 'ukrainian'
}

export enum CountryCode {
  ZH = 'ZH',
  JA = 'JA',
  KO = 'KO',
  TH = 'TH',
  BG = 'BG',
  CS = 'CS',
  DA = 'DA',
  DE = 'DE',
  EN = 'EN',
  ES = 'ES',
  EL = 'EL',
  FR = 'FR',
  IT = 'IT',
  HU = 'HU',
  NL = 'NL',
  NO = 'NO',
  PL = 'PL',
  PT = 'PT',
  RO = 'RO',
  RU = 'RU',
  FI = 'FI',
  SV = 'SV',
  TR = 'TR',
  VI = 'VI',
  UK = 'UK'
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
    language: Languages.schinese,
    currency: Currency.YenSign,
    countryCode: CountryCode.ZH
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
