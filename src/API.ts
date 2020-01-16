import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from 'axios';
import { Currency } from './utils';

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

const handleResponse = <T>(response: AxiosResponse<T>): AxiosResponse<T> => response;

const handleError = (error: AxiosError): IResponse<IPriceError> => {
  if (error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
    return { data: error.response.data || { success: false }, status: error.response.status };
  }
  console.log(error.message);
  return { data: { success: false }, status: 500 };
};

const BASE_URL: string = 'https://steamcommunity.com/market';
export const PRICE_OVERVIEW_URL = (
  appid: string,
  country: string,
  currency: Currency,
  market_hash_name: string
): string =>
  `/priceoverview?appid=${appid}&country=${country}&currency=${currency}&market_hash_name=${market_hash_name}`;

export const PRICE_HISTIRY_URL = (
  appid: string,
  country: string,
  currency: Currency,
  market_hash_name: string
): string =>
  `/pricehistory?appid=${appid}&country=${country}&currency=${currency}&market_hash_name=${market_hash_name}`;

export const ITEM_TYPE_URL = (appid: string, country: string, currency: Currency, market_hash_name: string): string =>
  `/listings/${appid}/${market_hash_name}/render/?start=0&count=1&language=${country}&currency=${currency}`;

export const SUB_ITEMS_URL = 'http://steamcommunity.com/market/search?q=';

const config: AxiosRequestConfig = {
  baseURL: BASE_URL,
  withCredentials: true
};

const fetchAPI: AxiosInstance = axios.create(config);

export const createReq = (url: string) =>
  fetchAPI
    .get(url)
    .then(handleResponse)
    .catch(handleError);
