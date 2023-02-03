import ky, { Options } from 'ky';
import toastr from 'toastr';

import { IItemInfo, SteamPrice } from './interfaces';

const config: Options = {
  prefixUrl: 'https://steamcommunity.com/market/',
};

const instance = ky
  .create(config)
  .extend({ hooks: { beforeError: [(error) => (toastr.error(error.message), error)] } });

export const fetchItemInfo = (appid: string, market_hash_name: string, resultsCount: number = 1) => {
  return instance
    .get(
      `search/render/?search_descriptions=1&count=${resultsCount}&appid=${appid}&norender=1&query=${market_hash_name}`,
    )
    .json<IItemInfo>();
};

export const fetchItemPrice = (country: string, language: string, currency: number, item_nameid: string) => {
  return instance
    .get(
      `itemordershistogram?country=${country}&language=${language}&currency=${currency}&item_nameid=${item_nameid}&two_factor=0`,
    )
    .json<SteamPrice>();
};
