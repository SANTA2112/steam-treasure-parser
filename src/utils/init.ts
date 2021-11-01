import { IInit } from '../interfaces';
import { Groups, TCurrencyIds } from '../types';
import { findPattern, addSelectListener } from './common';

export const init = (): IInit => {
  const parsedString: RegExpMatchArray = window.location.href.match(
    /https?:\/\/steamcommunity.com\/market\/listings\/(?<appid>\d+)\/(?<market_hash_name>.+)/,
  )!;
  const { appid, market_hash_name } = parsedString.groups as Groups;

  let language = 'english';
  let country: string = 'US';
  let currency: TCurrencyIds = 1;

  const scripts = [...document.querySelectorAll('script')];

  for (const script of scripts) {
    const matchRes = findPattern(script.outerHTML, 'g_strLanguage = "(.+?)"');
    const matchRes2 = findPattern(script.outerHTML, '"wallet_country":"(.+?)"');
    const matchRes3 = findPattern(script.outerHTML, '"wallet_currency":(\\d+?)');
    if (matchRes !== null) language = matchRes;
    if (matchRes2 !== null) country = matchRes2;
    if (matchRes3 !== null) currency = +matchRes3 as TCurrencyIds;
  }

  addSelectListener();

  return { appid, market_hash_name, currency, language, country };
};
