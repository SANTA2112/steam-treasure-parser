export type Groups = {
  [key: string]: string;
};

export type PricesPerYearArr = {
  [key: string]: number[];
};

export type PricesPerYear = {
  [key: string]: number;
};

export type PriceValues = [string, number, string][];

export type ItemsType =
  | 'case'
  | 'treasure'
  | 'trove carafe'
  | 'container'
  | 'souvenir package'
  | 'capsule'
  | 'crate'
  | 'safe'
  | 'holo-foil';

export type TMonths = 'Dec' | 'Jan' | 'Feb' | 'Mar' | 'Apr' | 'May' | 'Jun' | 'Jul' | 'Aug' | 'Sep' | 'Oct' | 'Nov';

const currencyIds = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  9000,
  9001,
] as const;

export type TCurrencyIds = typeof currencyIds[number];

export type TCurrencyValues = { [k in TCurrencyIds]: string };

export type TQuantityOfSales = { day: number; week: number; month: number; year: number };
