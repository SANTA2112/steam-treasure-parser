export type PriceValues = [string, number, string][];

const currencyIds = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
  34, 35, 36, 37, 38, 39, 40, 41, 9000, 9001,
] as const;

export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

export type TMonths = typeof months[number];

export type TCurrencyIds = typeof currencyIds[number];

export type TCurrencyValues = { [k in TCurrencyIds]: string };

export type TQuantityOfSales = { day: string; week: string; month: string; year: string };

export type Quarters = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export type MonthsQuarter = {
  [key in TMonths]: Quarters;
};
