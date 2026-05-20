import { fixJson } from './utils/common';

const balanceTargetUrl = '/IParentalService/GetParentalSettings';
const lotsTargetUrl = '/market/listings/';
const updatePrices = '/orderbook';

(function () {
  const originalFetch = window.fetch;

  window.fetch = async function (...args) {
    const [resource] = args;
    const url = resource instanceof Request ? resource.url : String(resource);

    if (resource instanceof Request && resource.headers.has('client')) {
      return await originalFetch.apply(this, args);
    }

    if (url.includes(balanceTargetUrl)) {
      window.postMessage(
        {
          type: 'page STP',
        },
        '*',
      );
    }

    const res = await originalFetch.apply(this, args);
    if (url.includes(lotsTargetUrl)) {
      const cloned = res.clone();
      cloned.text().then((data) => {
        window.postMessage(
          {
            type: 'lots STP',
            data: fixJson(data),
          },
          '*',
        );
      });
    }
    if (url.includes(updatePrices)) {
      const cloned = res.clone();
      cloned.json().then(({ data }) => {
        window.postMessage(
          {
            type: 'price STP',
            data: { sellPrice: data.amtMinSellOrder, buyPrice: data.amtMaxBuyOrder, currency: data.eCurrency },
          },
          '*',
        );
      });
    }
    return res;
  };
})();
