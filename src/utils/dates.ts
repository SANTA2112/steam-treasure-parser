import { eachDayOfInterval } from 'date-fns/eachDayOfInterval';
import { format } from 'date-fns/format';
import { addHours } from 'date-fns/addHours';
import { subYears } from 'date-fns/subYears';
import { subMonths } from 'date-fns/subMonths';
import { subWeeks } from 'date-fns/subWeeks';

import { FormatedSales, Sales, months } from '../types';

export const changeSalesDateByGMT = (sales: Sales): FormatedSales => {
  const timezoneOffset = -(new Date().getTimezoneOffset() / 60);

  return sales.map(([date, price, count]) => {
    const [month, day, year, hour] = date.split(' ');
    const dateObject = new Date(
      +year,
      months.findIndex((el) => el === month),
      +day,
      +hour.replace(':', ''),
    );
    const formattedDate = format(addHours(dateObject, timezoneOffset), 'yyyy-MM-dd');

    return { date: formattedDate, price, count: +count };
  });
};

const getDatesRange = (start: Date | number | string, end: Date | number | string, dateFormat: string) => {
  const range = eachDayOfInterval({ start, end });
  return range.map((date) => format(date, dateFormat));
};

const getQuantityInRange = (sales: FormatedSales, dates: string[]) => {
  return sales.filter((sale) => dates.includes(sale.date)).reduce((quantity, sale) => quantity + sale.count, 0);
};

export const getQuantityOfSales = (sales: FormatedSales) => {
  const currentDate = format(Date.now(), 'yyyy-MM-dd');
  const [salesPerDay, salesPerWeek, salesPerMonth, salesPerYear] = [
    getQuantityInRange(sales, [currentDate]),
    getQuantityInRange(sales, getDatesRange(subWeeks(currentDate, 1), currentDate, 'yyyy-MM-dd')),
    getQuantityInRange(sales, getDatesRange(subMonths(currentDate, 1), currentDate, 'yyyy-MM-dd')),
    getQuantityInRange(sales, getDatesRange(subYears(currentDate, 1), currentDate, 'yyyy-MM-dd')),
  ].map((quantity) => quantity.toLocaleString());
  return { day: salesPerDay, week: salesPerWeek, month: salesPerMonth, year: salesPerYear };
};
