import { getQuarter } from 'date-fns/getQuarter';
import { getYear } from 'date-fns/getYear';
import type { Price } from '../interfaces';
import type { PricesByYear, Quarters } from '../types';

export const getAveragePricePerQuarters = (sales: Price[]) => {
  const collected = sales.reduce<PricesByYear>((acc, sale) => {
    const year = String(getYear(sale.time));
    const quarter = String(getQuarter(sale.time)) as Quarters;

    acc[year] ??= {
      '1': { sum: 0, count: 0 },
      '2': { sum: 0, count: 0 },
      '3': { sum: 0, count: 0 },
      '4': { sum: 0, count: 0 },
    };

    acc[year][quarter].sum += sale.price_median;
    acc[year][quarter].count += 1;

    return acc;
  }, {});

  const result: Record<string, Record<Quarters, number>> = {};

  for (const year of Object.keys(collected)) {
    result[year] = {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
    };

    for (const quarter of ['1', '2', '3', '4'] as const) {
      if (year in collected) {
        const { sum, count } = collected[year]![quarter];
        result[year][quarter] = count ? Math.round((sum / count) * 100) / 100 : 0;
      }
    }
  }

  return result;
};

export const renderAveragePricePerQuarters = (
  prices: ReturnType<typeof getAveragePricePerQuarters>,
  itemNode: Element,
  priceSuffix: string,
): void => {
  const container = document.createElement('div'),
    tabsContainer = document.createElement('div'),
    contentContainer = document.createElement('div'),
    heading = document.createElement('div');
  container.classList.add('tabs-container');
  tabsContainer.classList.add('tabs-stp');
  contentContainer.classList.add('tabs-content-stp');
  heading.classList.add('tabs-heading');
  heading.textContent = 'Prices per quarter:';
  [heading, tabsContainer, contentContainer].forEach((el) => container.appendChild(el));
  Object.entries(prices).forEach(([year, qPrices], tIndex, tArr) => {
    const baseActiveElement = tIndex === tArr?.length - 1 ? ' active' : '';
    tabsContainer.insertAdjacentHTML('beforeend', `<button class="tab-stp${baseActiveElement}">${year}</button>`);
    contentContainer.insertAdjacentHTML(
      'beforeend',
      `<div class="prices-content-stp${baseActiveElement}">${Object.entries(qPrices)
        .map(([q, price]) => {
          return `<div class="price-content-stp">${q}: <span class="total-value-stp">${price} ${priceSuffix}</span></div>`;
        })
        .join('')}</div>`,
    );
  });

  itemNode.insertAdjacentElement('beforeend', container);
};

export const makePrice = (price: number, priceSuffix: string) => {
  return `${price / 100} ${priceSuffix}`;
};

export const renderPriceValue = (itemNode: Element, price: number, priceSuffix: string, type: 'sell' | 'buy') => {
  return itemNode.insertAdjacentHTML(
    'beforeend',
    `<div class="item-price-stp">Steam ${type} price: <span class="total-value-stp">${makePrice(price, priceSuffix)}</span></div>`,
  );
};

export const renderSalesRangeSlider = (itemNode: Element) => {
  return itemNode.insertAdjacentHTML(
    'beforeend',
    `<div class="range-slider-stp">
      <div class="date-wrapper-stp">
        <div class="date-info-stp start_date" data-value="0"></div>
        <div class="separator-stp">-</div>
        <div class="date-info-stp end_date-stp" data-value="0"></div>
      </div>
      <div class="progress-bar-stp">
        <div class="progress-stp"></div>
      </div>
      <div class="range-inputs-stp">
        <input type="range" class="range-input-stp range-min-stp" min="0" max="0" value="0" step="1" />
        <input type="range" class="range-input-stp range-max-stp" min="0" max="0" value="0" step="1" />
      </div>
      <div class="total-info-stp">
        <span class="total-text-stp">Total sales: </span><span class="total-value-stp">0</span>
      </div>
    </div>`,
  );
};

export const renderWrapper = (itemNode: Element): Element => {
  const wrapper = document.createElement('div');
  wrapper.classList.add('wrapper-stp');
  itemNode.insertAdjacentElement('afterend', wrapper);
  return wrapper;
};
