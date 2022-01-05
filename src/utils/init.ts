import { IInit, IPriceHistory } from '../interfaces';
import { TCurrencyIds } from '../types';
import { addSelectListener } from './common';

declare global {
  interface Window {
    g_strLanguage: string;
    g_strCountryCode: string;
    g_nWalletCurrency: TCurrencyIds;
    g_plotPriceHistory: {
      data: [IPriceHistory['prices']];
    };
  }
}

export const init = async (): Promise<IInit> => {
  const parsedString: RegExpMatchArray = globalThis.location.href.match(
    /https?:\/\/steamcommunity.com\/market\/listings\/(?<appid>\d+)\/(?<market_hash_name>.+)/,
  )!;
  const { appid, market_hash_name } = parsedString.groups as Record<string, string>;

  const language = window.g_strLanguage || 'english';
  const country = window.g_strCountryCode || 'US';
  const currency = window.g_nWalletCurrency || 1;
  const prices = window.g_plotPriceHistory?.data?.[0] || [];

  addSelectListener();

  return { appid, market_hash_name, currency, language, country, prices };
};
