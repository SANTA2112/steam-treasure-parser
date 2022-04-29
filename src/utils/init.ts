import { CurrencyData, IInit, IItemAssets, IPriceHistory, ListingInfo, WalletInfo } from '../interfaces';
import { addSelectListener } from './common';

declare global {
  interface Window {
    g_strLanguage: string;
    g_strCountryCode: string;
    g_rgWalletInfo: WalletInfo;
    g_plotPriceHistory: {
      data: [IPriceHistory['prices']];
    };
    g_rgAssets: IItemAssets;
    g_rgCurrencyData: Record<string, CurrencyData>;
    g_rgListingInfo: Record<string, ListingInfo>;
  }
}

export const init = (): IInit => {
  const [appid, market_hash_name] = window.location.pathname.split('/').slice(-2);

  const language = window.g_strLanguage || 'english';
  const country = window.g_strCountryCode || 'US';
  const currency = window.g_rgWalletInfo?.['wallet_currency'] || 1;
  const prices = window.g_plotPriceHistory?.data?.[0] || [];
  const { converted_price, converted_fee } = window.g_rgListingInfo[Object.keys(window.g_rgListingInfo)[0]];
  const item_price = converted_price + converted_fee;
  const item_nameid = window.document.body.innerHTML.match(/Market_LoadOrderSpread\(\s*(\d+)\s*\)/)?.[1] || '';
  const item_info =
    window.g_rgAssets[appid][Object.keys(window.g_rgAssets[appid])[0]][
      Object.keys(window.g_rgAssets[appid][Object.keys(window.g_rgAssets[appid])[0]])[0]
    ];
  const price_suffix =
    Object.values(window.g_rgCurrencyData).find((cur) => cur.eCurrencyCode === currency)?.strSymbol || '';

  addSelectListener();

  return {
    appid,
    market_hash_name,
    currency,
    language,
    country,
    prices,
    item_nameid,
    item_info,
    price_suffix,
    item_price,
  };
};
