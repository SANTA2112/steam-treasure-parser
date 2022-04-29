import { Quarters, TCurrencyIds } from './types';

export interface IFetcher<T, R> {
  (arg: T): Promise<R | R[]>;
}

export interface IFetchError<T> {
  message: string;
  src: T;
}

export interface IOptions {
  /** Колличество одновременных запросов */
  streams?: number;
  /** Время задержки между запросами в ms */
  timeout?: number;
}

export interface IDone<T, R> {
  results: R[];
  errors: IFetchError<T>[];
}

export interface IPriceHistory {
  success: boolean;
  price_prefix: string;
  price_suffix: string;
  prices: [string, number, string][];
}

export interface ISubItem {
  name: string;
  market_hash_name: string;
  image: string;
  price: string;
}

export interface IItemPropertyDescription {
  value: string;
  color?: string;
  subitems: ISubItem[];
  price: string;
  domNode: HTMLDivElement;
  image: string;
  market_hash_name: string;
}

export interface IItemProperties {
  descriptions: IItemPropertyDescription[];
  name: string;
  name_color: string;
  type: string;
  market_name: string;
  market_hash_name: string;
}

export interface IItemTypeResponce {
  success: boolean;
  assets: {
    [key: string]: {
      [key: string]: {
        [key: string]: IItemProperties;
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

export interface IInit {
  appid: string;
  market_hash_name: string;
  currency: TCurrencyIds;
  language: string;
  prices: IPriceHistory['prices'];
}

export interface IItemInfo {
  success: boolean;
  start: number;
  pagesize: number;
  total_count: number;
  searchdata: ISearchdata;
  results: IResult[];
}
interface ISearchdata {
  query: string;
  search_descriptions: boolean;
  total_count: number;
  pagesize: number;
  prefix: string;
  class_prefix: string;
}

interface IResult {
  name: string;
  hash_name: string;
  sell_listings: number;
  sell_price: number;
  sell_price_text: string;
  app_icon: string;
  app_name: string;
  asset_description: IAssetDescription;
  sale_price_text: string;
}

interface IAssetDescription {
  appid: number;
  classid: string;
  instanceid: string;
  background_color: string;
  icon_url: string;
  tradable: number;
  name: string;
  name_color: string;
  type: string;
  market_name: string;
  market_hash_name: string;
  commodity: number;
}

export interface pricesByQuarters {
  [key: string]: {
    [key in Quarters]: number[];
  };
}

export interface priceByQuarters {
  [key: string]: {
    [key in Quarters]: number;
  };
}
