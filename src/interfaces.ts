import { FormatedSales, Quarters } from './types';

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

export interface IItemAssets {
  [key: string]: {
    [key: string]: {
      [key: string]: IItemProperties;
    };
  };
}

export interface IInit {
  appid: string;
  market_hash_name: string;
  currency: number;
  language: string;
  country: string;
  prices: FormatedSales;
  item_nameid: string;
  item_info: IItemProperties;
  price_suffix: string;
  item_price: number;
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

export interface SteamPrice {
  highest_buy_order: string;
  lowest_sell_order: string;
  buy_order_graph: [number, number, string][];
  sell_order_graph: [number, number, string][];
  price_prefix: string;
  price_suffix: string;
}

export interface pricesByQuarters extends Record<string, Record<Quarters, number[]>> {}

export interface priceByQuarters extends Record<string, Record<Quarters, number>> {}

export interface WalletInfo {
  wallet_currency: number;
  wallet_country: string;
  wallet_state: string;
  wallet_fee: string;
  wallet_fee_minimum: string;
  wallet_fee_percent: string;
  wallet_publisher_fee_percent_default: string;
  wallet_fee_base: string;
  wallet_balance: string;
  wallet_delayed_balance: string;
  wallet_max_balance: string;
  wallet_trade_max_balance: string;
  success: number;
  rwgrsn: number;
}

export interface CurrencyData {
  strCode: string;
  eCurrencyCode: number;
  strSymbol: string;
  bSymbolIsPrefix: boolean;
  bWholeUnitsOnly: boolean;
  strDecimalSymbol: string;
  strThousandsSeparator: string;
  strSymbolAndNumberSeparator: string;
}

interface ListingAsset {
  currency: number;
  appid: number;
  contextid: string;
  id: string;
  amount: string;
}

export interface ListingInfo {
  listingid: string;
  price: number;
  fee: number;
  publisher_fee_app: number;
  publisher_fee_percent: string;
  currencyid: number;
  steam_fee: number;
  publisher_fee: number;
  converted_price: number;
  converted_fee: number;
  converted_currencyid: number;
  converted_steam_fee: number;
  converted_publisher_fee: number;
  converted_price_per_unit: number;
  converted_fee_per_unit: number;
  converted_steam_fee_per_unit: number;
  converted_publisher_fee_per_unit: number;
  asset: ListingAsset;
}
