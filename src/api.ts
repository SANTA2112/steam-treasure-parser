import axios, { AxiosRequestConfig } from 'axios';
import toastr from 'toastr';

import { IItemInfo, IItemAssets, SteamPrice } from './interfaces';

import { TCurrencyIds } from './types';

const config: AxiosRequestConfig = {
  baseURL: 'https://steamcommunity.com/market',
  withCredentials: true,
};

const instance = axios.create(config);

instance.interceptors.response.use(
  (response) => response.data,
  (error) => (toastr.error(error.message), error),
);

export const fetchItemType = (appid: string, language: string, currency: TCurrencyIds, market_hash_name: string) => {
  return instance.get<void, IItemAssets>(
    `/listings/${appid}/${market_hash_name}/render/?start=0&count=1&language=${language}&currency=${currency}`,
  );
};

export const fetchItemInfo = (appid: string, market_hash_name: string, resultsCount: number = 1) => {
  return instance.get<void, IItemInfo>(
    `/search/render/?search_descriptions=1&count=${resultsCount}&appid=${appid}&norender=1&query=${market_hash_name}`,
  );
};

export const fetchItemPrice = (country: string, language: string, currency: number, item_nameid: string) => {
  return instance.get<void, SteamPrice>(
    `/itemordershistogram?country=${country}&language=${language}&currency=${currency}&item_nameid=${item_nameid}&two_factor=0`,
  );
};
