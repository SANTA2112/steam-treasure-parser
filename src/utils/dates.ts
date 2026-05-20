import { eachDayOfInterval } from 'date-fns/eachDayOfInterval';
import { format } from 'date-fns/format';
import { subYears } from 'date-fns/subYears';
import { subMonths } from 'date-fns/subMonths';
import { subWeeks } from 'date-fns/subWeeks';

import type { Price } from '../interfaces';

const getDatesRange = (start: Date | number | string, end: Date | number | string, dateFormat: string) => {
  const range = eachDayOfInterval({ start, end });
  return range.map((date) => format(date, dateFormat));
};

const getQuantityInRange = (sales: Price[], dates: string[]) => {
  return sales
    .filter((sale) => dates.includes(format(sale.time, 'yyyy-MM-dd')))
    .reduce((quantity, sale) => quantity + sale.purchases, 0);
};

export const getQuantityOfSales = (sales: Price[]) => {
  const currentDate = format(Date.now(), 'yyyy-MM-dd');
  const [salesPerDay, salesPerWeek, salesPerMonth, salesPerYear] = [
    getQuantityInRange(sales, [currentDate]),
    getQuantityInRange(sales, getDatesRange(subWeeks(currentDate, 1), currentDate, 'yyyy-MM-dd')),
    getQuantityInRange(sales, getDatesRange(subMonths(currentDate, 1), currentDate, 'yyyy-MM-dd')),
    getQuantityInRange(sales, getDatesRange(subYears(currentDate, 1), currentDate, 'yyyy-MM-dd')),
  ].map((quantity) => quantity.toLocaleString());
  return { day: salesPerDay!, week: salesPerWeek!, month: salesPerMonth!, year: salesPerYear! };
};
