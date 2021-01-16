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

export type TQuantityOfSales = { day: number; month: number; year: number };
