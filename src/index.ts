import { createReq, PRICE_HISTIRY_URL, PRICE_OVERVIEW_URL, IResponse, IPrice, IPriceHistory, IPriceError } from './API';
import { init, getAveragePricePerYear } from './utils';

(async () => {
  const { gameID, currency, itemName, lng } = init();
  const getPrice = createReq(gameID, lng, currency, itemName);
  const itemPrice: IResponse<IPrice | IPriceError> = await getPrice(PRICE_OVERVIEW_URL);
  const itemPriceHistrory: IResponse<IPriceHistory | IPriceError> = await getPrice(PRICE_HISTIRY_URL);
  if (itemPrice.data.success && itemPriceHistrory.data.success) {
    console.log(itemPrice.data.lowest_price);
    console.log(getAveragePricePerYear(itemPriceHistrory.data.prices));
  }
})();
