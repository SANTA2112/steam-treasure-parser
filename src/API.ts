import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from 'axios';

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

export interface IPriceError {
  success: false;
}

export interface IResponse<T> {
  data: T;
  status: number;
}

const handleResponse = <T>(response: AxiosResponse<T>): IResponse<T> => ({
  data: response.data,
  status: response.status
});

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
export const PRICE_OVERVIEW_URL = '/priceoverview';
export const PRICE_HISTIRY_URL = '/pricehistory';

type URL = typeof PRICE_OVERVIEW_URL | typeof PRICE_HISTIRY_URL;

const config: AxiosRequestConfig = {
  baseURL: BASE_URL,
  withCredentials: true
};

const fetchAPI: AxiosInstance = axios.create(config);

export const createReq = (appid: number, country: string, currency: Currency, market_hash_name: string) => (url: URL) =>
  fetchAPI
    .get(`${url}?appid=${appid}&country=${country}&currency=${currency}&market_hash_name=${market_hash_name}`)
    .then(handleResponse)
    .catch(handleError);
