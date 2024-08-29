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
  itemNode: Element,
  priceSuffix: string,
): void => {
  const [container, tabsContainer, contentContainer, heading] = Array.from({ length: 4 }, () =>
    document.createElement('div'),
  );
  container.classList.add('tabs-container');
  tabsContainer.classList.add('tabs-stp');
  contentContainer.classList.add('tabs-content-stp');
  heading.classList.add('tabs-heading');
  heading.textContent = 'Prices per quarter:';
  [heading, tabsContainer, contentContainer].forEach((el) => container.appendChild(el));
  Object.entries(prices).forEach(([year, qPrices], tIndex, tArr) => {
    console.log(tArr, tArr.length);
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

export const renderPriceValue = (itemNode: Element, price: number, priceSuffix: string) => {
  return itemNode.insertAdjacentHTML(
    'beforeend',
    `<div class="item-price-stp">Steam price: <span class="total-value-stp">${price} ${priceSuffix}</span></div>`,
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
