import { Currency, Languages, CountryCode } from './enums';

export interface IPrice {
  success: boolean;
  lowest_price?: string;
  volume: string;
  median_price?: string;
}

export interface IPriceHistory {
  success: boolean;
  price_prefix: string;
  price_suffix: string;
  prices: [string, number, string][];
}
export interface IItemTypeResponce {
  success: boolean;
  assets: {
    [key: string]: {
      '2': {
        [key: string]: {
          descriptions?: {
            value: string;
            color?: string;
            type?: string;
          }[];
          name: string;
          name_color: string;
          type: string;
          market_name: string;
          market_hash_name: string;
        };
      };
    };
  };
}

export interface IPriceError {
  success: false;
  price_prefix?: string;
  price_suffix?: string;
  prices?: false;
}

export interface IResponse<T> {
  data: T;
  status: number;
}

export interface ICookie {
  browserid: string;
  timezoneOffset: string;
  steamCountry: string;
  recentapps: string;
  sessionid: string;
  app_impressions: string;
  Steam_Language: string;
}
export interface IInit {
  appid: string;
  market_hash_name: string;
  currency: Currency;
  language: Languages;
  country: CountryCode;
}
export interface ICountryInfo {
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

export interface ISubItem {
  name: string;
  market_hash_name: string;
  img: string;
}
