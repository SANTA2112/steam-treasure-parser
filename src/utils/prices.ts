import { getQuarter } from 'date-fns/getQuarter';
import { priceByQuarters, pricesByQuarters } from '../interfaces';
import { Quarters, FormatedSales } from '../types';

export const getAveragePricePerQuarters = (sales: FormatedSales) => {
  const collected: pricesByQuarters = {};
  for (const sale of sales) {
    const [year] = sale.date.split('-');
    const quarter = getQuarter(sale.date).toString();
    if (!collected[year]) {
      collected[year] = { '1': [], '2': [], '3': [], '4': [] };
    }
    collected[year][quarter as Quarters].push(sale.price);
  }

  const calculated: priceByQuarters = {};
  for (const year in collected) {
    if (year in collected) {
      calculated[year] = { '1': 0, '2': 0, '3': 0, '4': 0 };
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

export const renderPriceValue = (itemNode: Element, price: number, priceSuffix: string) => {
  return itemNode.insertAdjacentHTML(
    'beforeend',
    `<div>
      Price: ${price} ${priceSuffix}
    </div>`,
  );
};
