import type { IInit, QueryData } from '../interfaces';

declare global {
  interface Window {
    SSR: {
      renderContext: {
        queryData: string;
      };
    };
  }
}

export const init = (queryDataFromRequest?: QueryData): IInit => {
  const queryData: QueryData = queryDataFromRequest ?? JSON.parse(window.SSR.renderContext.queryData);
  const pricesData = queryData.queries.find((query) => query.queryKey.includes('orderbook'))!;
  const priceHistory = queryData.queries.find((query) => query.queryKey.includes('pricehistory'))!;
  const marketItemInfo = queryData.queries.find((query) => query.queryKey.includes('description'))!;

  const currency = pricesData.state.data.eCurrency!.toString() as IInit['currency'];
  const itemSellPrice = pricesData.state.data.amtMinSellOrder!;
  const itemBuyPrice = pricesData.state.data.amtMaxBuyOrder!;
  const prices = priceHistory.state.data.prices!.map((sale) => ({ ...sale, time: sale.time * 1000 }));

  const description = marketItemInfo.state.data;
  const urlPath = new URL(window.location.href).pathname.split('/');
  const { descriptions = [], appid = urlPath.at(-1) || 'Unknown APP ID' } = description;

  return { appid: String(appid), currency, itemSellPrice, itemBuyPrice, prices, descriptions };
};
