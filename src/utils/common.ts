import { FormatedSales } from '../types';

export const addSelectListener = () => {
  document.addEventListener<'click'>('click', (event) => {
    if (event.target) {
      const { parentElement } = event.target as unknown as HTMLElement;
      if (parentElement?.classList.contains('select-stp')) parentElement.classList.toggle('active');
    }
  });
};

export const addRangeSliderScript = (salesRaw: FormatedSales) => {
  const sales = Object.entries(
    salesRaw.reduce<Record<string, number>>(
      (acc, sale) => ((acc[sale.date] = (acc[sale.date] ?? 0) + sale.count), acc),
      {},
    ),
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
  rangeInputElements.forEach((range) => range.setAttribute('max', maxDateIndex.toString()));
  rangeMax.setAttribute('value', maxDateIndex.toString());
  dateInfoMin.textContent = sales[minDateIndex].date;
  dateInfoMax.textContent = sales[maxDateIndex].date;
  dateInfoMin.dataset.value = minDateIndex.toString();
  dateInfoMax.dataset.value = maxDateIndex.toString();
  totalContainer.textContent = calcTotalSales(sales[minDateIndex].date, sales[maxDateIndex].date).toLocaleString();

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
        dateInfoMin.textContent = sales[minRangeVal].date;
        dateInfoMax.textContent = sales[maxRangeVal].date;
        progressBarElement.style.left = `${start}%`;
        progressBarElement.style.right = `${end}%`;
        totalContainer.textContent = calcTotalSales(sales[minRangeVal].date, sales[maxRangeVal].date).toLocaleString();
      } else {
        const start = (maxRangeVal / Number(rangeMin.max)) * 100;
        const end = 100 - (minRangeVal / Number(rangeMax.max)) * 100;
        dateInfoMin.textContent = sales[maxRangeVal].date;
        dateInfoMax.textContent = sales[minRangeVal].date;
        progressBarElement.style.left = `${start}%`;
        progressBarElement.style.right = `${end}%`;
        totalContainer.textContent = calcTotalSales(sales[maxRangeVal].date, sales[minRangeVal].date).toLocaleString();
      }
    });
  });
};
