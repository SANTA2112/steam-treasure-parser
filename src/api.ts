import ky, { type Options } from 'ky';
import toastr from 'toastr';

import type { API } from './api.types';
import { fixJson } from './utils/common';

const config: Options = {
  prefix: 'https://steamcommunity.com/market/',
  credentials: 'include',
  headers: { client: 'ky' },
};

const instance = ky
  .create(config)
  .extend({ hooks: { beforeError: [({ error }) => (toastr.error(error.message), error)] } });

export const getMarketHashName = async (itemName: string) => {
  const res = await instance
    .get(`searchsuggestionsresults`, { searchParams: { q: itemName } })
    .json<API.MarketHashNameResponse>();
  return res.results;
};

export const fetchItemInfo = (appid: string, market_hash_name: string) => {
  return instance
    .post(`listings/${appid}/${market_hash_name}`, {
      headers: {
        'x-valve-action-type': '4OPT6VBA:Search',
        'x-valve-request-type': 'routeAction',
        'content-type': 'application/json; charset=utf-8',
      },
      searchParams: { appid },
      body: JSON.stringify([
        {
          appid,
          strItemName: market_hash_name,
          accessoryFilters: {},
          propertyFilters: {},
          start: 0,
        },
      ]),
    })
    .json<API.ItemListingResponse>();
};

export const fetchCSItemInfo = async (appid: string, market_hash_name: string) => {
  const data = await instance
    .get(`listings/${appid}/${market_hash_name}`, { headers: { 'x-valve-request-type': 'routeData' } })
    .text();
  return JSON.parse(fixJson(data)) as API.CSItemInfoResponse;
};

export const fetchItemPrice = async (appid: string, market_hash_name: string) => {
  const r = await instance
    .get('orderbook', { searchParams: { q: 'Load', qp: `[${appid}, "${market_hash_name}"]` } })
    .json<API.PriceResponse>();
  return r.data;
};
