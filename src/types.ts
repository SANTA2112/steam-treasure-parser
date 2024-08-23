export type Sales = [string, number, string][];

export type FormatedSales = { date: string; price: number; count: number }[];

export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

export type TQuantityOfSales = { day: string; week: string; month: string; year: string };

export type Quarters = '1' | '2' | '3' | '4';
