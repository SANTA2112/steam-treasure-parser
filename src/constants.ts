import { options } from 'toastr';

import { ItemsType, TMonths, TCurrencyIds, TCurrencyValues } from './types';

export const itemTypes: ItemsType[] = [
  'souvenir package',
  'capsule',
  'container',
  'case',
  'treasure',
  'crate',
  'safe',
  'holo-foil',
  'trove carafe',
];

export const BASE_URL: string = 'https://steamcommunity.com/market';

export const PRICE_OVERVIEW_URL = (
  appid: string,
  country: string,
  currency: TCurrencyIds,
  market_hash_name: string
): string =>
  `/priceoverview?appid=${appid}&country=${country}&currency=${currency}&market_hash_name=${market_hash_name}`;

export const PRICE_HISTIRY_URL = (
  appid: string,
  country: string,
  currency: TCurrencyIds,
  market_hash_name: string
): string =>
  `/pricehistory?appid=${appid}&country=${country}&currency=${currency}&market_hash_name=${market_hash_name}`;

export const ITEM_TYPE_URL = (
  appid: string,
  language: string,
  currency: TCurrencyIds,
  market_hash_name: string
): string => `/listings/${appid}/${market_hash_name}/render/?start=0&count=1&language=${language}&currency=${currency}`;

export const SUB_ITEMS_URL = 'https://steamcommunity.com/market/search?q=';

export const toastrOptions: typeof options = {
  closeButton: true,
  newestOnTop: false,
  progressBar: true,
  preventDuplicates: true,
  showDuration: 300,
  hideDuration: 1000,
  timeOut: 3000,
  extendedTimeOut: 1000,
  showEasing: 'swing',
  hideEasing: 'linear',
  showMethod: 'fadeIn',
  hideMethod: 'fadeOut',
  positionClass: 'toast-bottom-left',
};

export const months: TMonths[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const currencyIds: TCurrencyValues = {
  '1': 'USD',
  '2': 'GBP',
  '3': 'EUR',
  '4': 'CHF',
  '5': 'RUB',
  '6': 'PLN',
  '7': 'BRL',
  '8': 'JPY',
  '9': 'NOK',
  '10': 'IDR',
  '11': 'MYR',
  '12': 'PHP',
  '13': 'SGD',
  '14': 'THB',
  '15': 'VND',
  '16': 'KRW',
  '17': 'TRY',
  '18': 'UAH',
  '19': 'MXN',
  '20': 'CAD',
  '21': 'AUD',
  '22': 'NZD',
  '23': 'CNY',
  '24': 'INR',
  '25': 'CLP',
  '26': 'PEN',
  '27': 'COP',
  '28': 'ZAR',
  '29': 'HKD',
  '30': 'TWD',
  '31': 'SAR',
  '32': 'AED',
  '34': 'ARS',
  '35': 'ILS',
  '36': 'BYN',
  '37': 'KZT',
  '38': 'KWD',
  '39': 'QAR',
  '40': 'CRC',
  '41': 'UYU',
  '9000': 'RMB',
  '9001': 'NXP',
};
