import { options } from 'toastr';

import { ICountryInfo } from './interfaces';
import { ItemsType } from './types';
import { Currency, Languages, CountryCode } from './enums';

export const countryInfoArray: ICountryInfo[] = [
  {
    language: Languages.brazilian,
    currency: Currency.BRL,
    countryCode: CountryCode.BR
  },
  {
    language: Languages.bulgarian,
    currency: Currency.USD,
    countryCode: CountryCode.BG
  },
  {
    language: Languages.czech,
    currency: Currency.USD,
    countryCode: CountryCode.CZ
  },
  {
    language: Languages.danish,
    currency: Currency.USD,
    countryCode: CountryCode.DK
  },
  {
    language: Languages.dutch,
    currency: Currency.EUR,
    countryCode: CountryCode.NL
  },
  {
    language: Languages.english,
    currency: Currency.USD,
    countryCode: CountryCode.EN
  },
  {
    language: Languages.finnish,
    currency: Currency.USD,
    countryCode: CountryCode.FI
  },
  {
    language: Languages.french,
    currency: Currency.USD,
    countryCode: CountryCode.FR
  },
  {
    language: Languages.german,
    currency: Currency.USD,
    countryCode: CountryCode.DE
  },
  {
    language: Languages.greek,
    currency: Currency.USD,
    countryCode: CountryCode.GR
  },
  {
    language: Languages.hungarian,
    currency: Currency.USD,
    countryCode: CountryCode.HU
  },
  {
    language: Languages.italian,
    currency: Currency.USD,
    countryCode: CountryCode.IT
  },
  {
    language: Languages.japanese,
    currency: Currency.JPY,
    countryCode: CountryCode.JP
  },
  {
    language: Languages.koreana,
    currency: Currency.KRW,
    countryCode: CountryCode.KR
  },
  {
    language: Languages.latam,
    currency: Currency.USD,
    countryCode: CountryCode.ES
  },
  {
    language: Languages.norwegian,
    currency: Currency.NOK,
    countryCode: CountryCode.NO
  },
  {
    language: Languages.polish,
    currency: Currency.PLN,
    countryCode: CountryCode.PL
  },
  {
    language: Languages.portuguese,
    currency: Currency.USD,
    countryCode: CountryCode.PT
  },
  {
    language: Languages.romanian,
    currency: Currency.USD,
    countryCode: CountryCode.RO
  },
  {
    language: Languages.russian,
    currency: Currency.RUB,
    countryCode: CountryCode.RU
  },
  {
    language: Languages.schinese,
    currency: Currency.CNY,
    countryCode: CountryCode.CN
  },
  {
    language: Languages.spanish,
    currency: Currency.USD,
    countryCode: CountryCode.ES
  },
  {
    language: Languages.swedish,
    currency: Currency.CHF,
    countryCode: CountryCode.SE
  },
  {
    language: Languages.tchinese,
    currency: Currency.CNY,
    countryCode: CountryCode.TW
  },
  {
    language: Languages.thai,
    currency: Currency.THB,
    countryCode: CountryCode.TH
  },
  {
    language: Languages.turkish,
    currency: Currency.TRY,
    countryCode: CountryCode.TR
  },
  {
    language: Languages.ukrainian,
    currency: Currency.UAH,
    countryCode: CountryCode.UA
  },
  {
    language: Languages.vietnamese,
    currency: Currency.VND,
    countryCode: CountryCode.VN
  }
];

export const itemTypes: ItemsType[] = [
  'souvenir package',
  'capsule',
  'container',
  'case',
  'treasure',
  'crate',
  'safe',
  'holo-foil',
  'trove carafe'
];

export const BASE_URL: string = 'https://steamcommunity.com/market';

export const PRICE_OVERVIEW_URL = (
  appid: string,
  country: CountryCode,
  currency: Currency,
  market_hash_name: string
): string =>
  `/priceoverview?appid=${appid}&country=${country}&currency=${currency}&market_hash_name=${market_hash_name}`;

export const PRICE_HISTIRY_URL = (
  appid: string,
  country: CountryCode,
  currency: Currency,
  market_hash_name: string
): string =>
  `/pricehistory?appid=${appid}&country=${country}&currency=${currency}&market_hash_name=${market_hash_name}`;

export const ITEM_TYPE_URL = (
  appid: string,
  language: Languages,
  currency: Currency,
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
  positionClass: 'toast-bottom-left'
};
