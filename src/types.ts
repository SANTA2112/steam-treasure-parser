export type PriceValues = [string, number, string][];

export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

export type TMonths = typeof months[number];

export type TQuantityOfSales = { day: string; week: string; month: string; year: string };

export type Quarters = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export type MonthsQuarter = Record<TMonths, Quarters>;
