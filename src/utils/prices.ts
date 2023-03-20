import { quarters } from '../constants';
import { priceByQuarters, pricesByQuarters } from '../interfaces';
import { PriceValues, TMonths, Quarters } from '../types';

export const getAveragePricePerQuarters = (prices: PriceValues) => {
  const init: pricesByQuarters = {};
  for (const [priceDate] of prices) {
    const year = priceDate.split(' ')[2];
    if (!init[year]) {
      init[year] = { Q1: [], Q2: [], Q3: [], Q4: [] };
    }
  }

  const collected: pricesByQuarters = {};
  for (const [priceDate, priceRaw] of prices) {
    const [month, , year] = priceDate.split(' ');
    const quarter = quarters[month as TMonths];
    if (!collected[year]) {
      collected[year] = { Q1: [], Q2: [], Q3: [], Q4: [] };
    }
    collected[year][quarter].push(priceRaw);
  }

  const calculated: priceByQuarters = {};
  for (const year in collected) {
    if (year in collected) {
      calculated[year] = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
      for (const quarter in collected[year]) {
        if (quarter in collected[year]) {
          const qPrices = collected[year][quarter as Quarters];
          calculated[year][quarter as Quarters] =
            Math.round((qPrices.reduce((acc, price) => acc + price, 0) / qPrices.length) * 100) / 100 || 0;
        }
      }
    }
  }
  return calculated;
};
export const renderAveragePricePerQuarters = (
  prices: priceByQuarters,
  itemNode: Element | null,
  priceSuffix: string,
): void => {
  const container = document.createElement('div');
  const options = Object.entries(prices)
    .map(([year, qPrices]) => {
      const pricesHtml = Object.entries(qPrices)
        .map(([q, price]) => {
          return `<div class="item__price-stp">${q}: ${price} ${priceSuffix}</div>`;
        })
        .join('');
      return `<div class="item__container-stp">
          <div class="item-stp" style="color: #ffffff">${year}: ${pricesHtml}</div>
        </div>`;
    })
    .join('');

  container.classList.add('select-stp');
  container.innerHTML = `<svg class="select__arrow-stp" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z" class=""></path></svg>
      <div class="select__label-stp" style="color: #ffffff">Prices per quarters</div>
      <div class="select__options-stp">${options}</div>`;
  itemNode?.insertAdjacentElement('beforeend', container);
};
