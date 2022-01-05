import { quarters } from '../constants';
import { priceByQuarters, pricesByQuarters } from '../interfaces';
import { PriceValues, TMonths, Quarters } from '../types';

export const getAveragePricePerQuarters = (prices: PriceValues): priceByQuarters => {
  const init = [...new Set(prices.map(([priceDate]) => priceDate.split(' ')[2]))].reduce<pricesByQuarters>(
    (acc, year) => ((acc[year] = { Q1: [], Q2: [], Q3: [], Q4: [] }), acc),
    {},
  );

  const collected = prices.reduce<pricesByQuarters>((acc, [priceDate, priceRaw]) => {
    const [month, , year] = priceDate.split(' ');
    return acc[year][quarters[month as TMonths]].push(priceRaw), acc;
  }, init);

  const calculated: priceByQuarters = {};

  for (const year in collected) {
    if (Object.prototype.hasOwnProperty.call(collected, year)) {
      calculated[year] = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
      for (const quarter in collected[year]) {
        if (Object.prototype.hasOwnProperty.call(collected[year], quarter)) {
          const qPrices = collected[year][quarter as Quarters];
          calculated[year][quarter as Quarters] = +(
            qPrices.reduce((acc, price) => acc + price, 0) / qPrices.length || 0
          ).toFixed(2);
        }
      }
    }
  }
  return calculated;
};

export const renderAveragePricePerQuarters = (
  prices: priceByQuarters,
  itemNode: Element | null,
  pricePrefix: string = '',
  priceSuffix: string = '',
): void => {
  const container: HTMLDivElement = document.createElement('div');

  container.classList.add('select-stp');
  container.innerHTML = `
    <svg class="select__arrow-stp" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z" class=""></path></svg>
    <div class="select__label-stp" style="color: #ffffff">Prices per quarters</div>
    <div class="select__options-stp">
      ${Object.entries(prices)
        .map(
          ([year, qPrices]) => `
        <div class="item__container-stp">
          <div
            class="item-stp"
            style="color: #ffffff"
          >${year}: ${Object.entries(qPrices)
            .map(([q, price]) => `<div class="item__price-stp">${q}: ${pricePrefix}${price} ${priceSuffix}</div>`)
            .join('')}</div
          >
        </div>
      `,
        )
        .join('')}
    </div>
    `;
  itemNode?.insertAdjacentElement('beforeend', container);
};
