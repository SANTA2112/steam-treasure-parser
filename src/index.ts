import { createReq, PRICE_HISTIRY_URL, PRICE_OVERVIEW_URL, IResponse, IPrice, IPriceHistory, IPriceError } from './API';
import { init, getAveragePricePerYear } from './utils';

(async () => {
  const { gameID, currency, itemName, lng, country } = init();
  const itemPrice: IResponse<IPrice | IPriceError> = await createReq(
    PRICE_OVERVIEW_URL(gameID, lng, currency, itemName)
  );
  const itemPriceHistrory: IResponse<IPriceHistory | IPriceError> = await createReq(
    PRICE_HISTIRY_URL(gameID, lng, currency, itemName)
  );
  if (itemPrice.data.success && itemPriceHistrory.data.success) {
    console.log(itemPrice.data.lowest_price);
    console.log(getAveragePricePerYear(itemPriceHistrory.data.prices));
  }
})();
