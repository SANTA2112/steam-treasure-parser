import { PriceValues, TQuantityOfSales, months } from '../types';

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
  const range = Math.floor((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));
  let currentDate = date1;

  for (let i = 0; i < range; i++) {
    const lastDay = getLastDay(currentDate);
    dates.push(lastDay);
    currentDate = lastDay;
  }

  return dates;
};

export const getQuantityOfSales = (prices: PriceValues): TQuantityOfSales => {
  const date = new Date();

  const getPriceIndexByDate = getPriceIndexByDateSetParams(prices);

  const [salesPerDay, salesPerWeek, salesPerMonth, salesPerYear] = [
    getLastDay(date),
    getLastWeek(date),
    getLastMonth(date),
    getLastYear(date),
  ].map((neededDate) => {
    const datesRange = getDatesRange(date, neededDate).reverse();
    const index = getPriceIndexByDate(datesRange);
    return index !== -1 ? prices.slice(index).reduce((a, [, , quantity]) => +quantity + a, 0) : 0;
  });

  return {
    day: salesPerDay.toLocaleString(),
    week: salesPerWeek.toLocaleString(),
    month: salesPerMonth.toLocaleString(),
    year: salesPerYear.toLocaleString(),
  };
};
