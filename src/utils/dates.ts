import { months } from '../constants';
import { PriceValues, TQuantityOfSales } from '../types';

const getPriceIndexByDateSetParams = (prices: PriceValues) => (dates: Date[]) => {
  for (const date of dates) {
    const index = prices.findIndex(([priceDate]) => {
      const [monthPrice, dayPrice, yearPrice] = priceDate.split(' ');
      return (
        +dayPrice === date.getDate() && monthPrice === months[date.getMonth()] && +yearPrice === date.getFullYear()
      );
    });
    if (index !== -1) return index;
  }
  return -1;
};

const getLastDay = (today: Date) => new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
const getLastWeek = (today: Date) => new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
const getLastMonth = (today: Date) => new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
const getLastYear = (today: Date) => new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

const getDatesRange = (date1: Date, date2: Date) => {
  const dates = [];
  const range = Math.floor((date1.getTime() - date2.getTime()) / 1000 / 60 / 60 / 24);
  let currentDate = date1;

  for (let i = 0; i < range; i++) {
    dates.push(getLastDay(currentDate));
    currentDate = getLastDay(currentDate);
  }

  return dates;
};

export const getQuantityOfSales = (prices: PriceValues): TQuantityOfSales => {
  const tempDate = new Date();
  const date = new Date(
    tempDate.getUTCFullYear(),
    tempDate.getUTCMonth(),
    tempDate.getUTCDate(),
    tempDate.getUTCHours(),
    tempDate.getUTCMinutes(),
    tempDate.getUTCSeconds(),
  );

  const getPriceIndexByDate = getPriceIndexByDateSetParams(prices);

  const [salesPerDay, salesPerWeek, salesPerMonth, salesPerYear] = [
    getLastDay(date),
    getLastWeek(date),
    getLastMonth(date),
    getLastYear(date),
  ]
    .map((neededDate) => getPriceIndexByDate(getDatesRange(date, neededDate).reverse()))
    .map((index) => (index !== -1 ? prices.slice(index).reduce((a, [, , quantity]) => +quantity + a, 0) : 0));

  return {
    day: salesPerDay.toLocaleString(),
    week: salesPerWeek.toLocaleString(),
    month: salesPerMonth.toLocaleString(),
    year: salesPerYear.toLocaleString(),
  };
};
