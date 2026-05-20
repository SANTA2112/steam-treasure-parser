import { format } from 'date-fns';
import type { Price } from '../interfaces';

export const fixJson = (data: string) => {
  return `[${data.replaceAll(/\n/g, '').replaceAll(/(\}\{)|(\}true\{)/g, '},{')}]`;
};

export const addSelectListener = () => {
  document.addEventListener<'click'>('click', (event) => {
    if (event.target) {
      const target = event.target as unknown as HTMLDivElement;
      const { parentElement } = target;
      if (target.classList.contains('select-stp')) target.classList.toggle('active');
      if (parentElement?.classList.contains('select-stp')) parentElement.classList.toggle('active');
    }
  });
};

export const addRangeSliderScript = (salesRaw: Price[]) => {
  const sales = Object.entries(
    salesRaw.reduce<Record<string, number>>((acc, sale) => {
      const date = format(sale.time, 'yyyy-MM-dd');
      acc[date] = (acc[date] ?? 0) + sale.purchases;
      return acc;
    }, {}),
  ).map(([date, count]) => ({ date, count }));

  const calcTotalSales = (startDate: string, endDate: string) => {
    const startIndex = sales.findIndex((el) => el.date === startDate);
    const endIndex = Math.min(sales.findLastIndex((el) => el.date === endDate) + 1, sales.length);
    return sales.slice(startIndex, endIndex).reduce((acc, cur) => acc + cur.count, 0);
  };

  const rangeSliderElement = document.querySelector('.range-slider-stp');
  if (!rangeSliderElement) return null;

  const rangeInputElements = rangeSliderElement.querySelectorAll<HTMLInputElement>(
    '.range-inputs-stp .range-input-stp',
  );
  const dateInfoElements = rangeSliderElement.querySelectorAll<HTMLDivElement>('.date-wrapper-stp .date-info-stp');
  const progressBarElement = rangeSliderElement.querySelector<HTMLDivElement>('.progress-bar-stp .progress-stp')!;
  const totalContainer = rangeSliderElement.querySelector<HTMLSpanElement>('.total-info-stp .total-value-stp')!;
  const minDateIndex = 0;
  const maxDateIndex = Math.max(1, sales.length - 1);
  const [rangeMin, rangeMax] = rangeInputElements;
  const [dateInfoMin, dateInfoMax] = dateInfoElements;
  if (rangeMin && rangeMax && dateInfoMin && dateInfoMax) {
    rangeInputElements.forEach((range) => range.setAttribute('max', maxDateIndex.toString()));
    rangeMax.setAttribute('value', maxDateIndex.toString());
    dateInfoMin.textContent = sales[minDateIndex]!.date;
    dateInfoMax.textContent = sales[maxDateIndex]!.date;
    dateInfoMin.dataset.value = minDateIndex.toString();
    dateInfoMax.dataset.value = maxDateIndex.toString();
    totalContainer.textContent = calcTotalSales(sales[minDateIndex]!.date, sales[maxDateIndex]!.date).toLocaleString();

    rangeInputElements.forEach((input) => {
      input.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        const minRangeVal = parseInt(rangeMin.value);
        const maxRangeVal = parseInt(rangeMax.value);
        const isMinInput = target.classList.contains('range-min-stp');
        const rangeVal = isMinInput ? minRangeVal : maxRangeVal;

        if (isMinInput) {
          rangeMin.value = rangeVal.toString();
          dateInfoMin.dataset.value = rangeVal.toString();
        } else {
          rangeMax.value = rangeVal.toString();
          dateInfoMax.dataset.value = rangeVal.toString();
        }

        if (minRangeVal <= maxRangeVal) {
          const start = (minRangeVal / Number(rangeMin.max)) * 100;
          const end = 100 - (maxRangeVal / Number(rangeMax.max)) * 100;
          dateInfoMin.textContent = sales[minRangeVal]!.date;
          dateInfoMax.textContent = sales[maxRangeVal]!.date;
          progressBarElement.style.left = `${start}%`;
          progressBarElement.style.right = `${end}%`;
          totalContainer.textContent = calcTotalSales(
            sales[minRangeVal]!.date,
            sales[maxRangeVal]!.date,
          ).toLocaleString();
        } else {
          const start = (maxRangeVal / Number(rangeMin.max)) * 100;
          const end = 100 - (minRangeVal / Number(rangeMax.max)) * 100;
          dateInfoMin.textContent = sales[maxRangeVal]!.date;
          dateInfoMax.textContent = sales[minRangeVal]!.date;
          progressBarElement.style.left = `${start}%`;
          progressBarElement.style.right = `${end}%`;
          totalContainer.textContent = calcTotalSales(
            sales[maxRangeVal]!.date,
            sales[minRangeVal]!.date,
          ).toLocaleString();
        }
      });
    });
  }
};

export const addTabsScript = () => {
  const tabs = Array.from(document.querySelectorAll('.tab-stp'));
  const data = Array.from(document.querySelectorAll('.prices-content-stp'));

  const activateTab = (index: number) => {
    tabs.forEach((tab) => tab.classList.remove('active'));
    data.forEach((el) => el.classList.remove('active'));
    tabs[index]!.classList.add('active');
    data[index]!.classList.add('active');
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      activateTab(i);
    });
  });
};

export const waitForSelector = async <T extends Element>(selector: string): Promise<T | null> => {
  return new Promise((resolve) => {
    const element = document.querySelector<T>(selector);
    if (element) {
      return resolve(element);
    }

    const observer = new MutationObserver(() => {
      const foundElement = document.querySelector<T>(selector);
      if (foundElement) {
        observer.disconnect();
        resolve(foundElement);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
};
