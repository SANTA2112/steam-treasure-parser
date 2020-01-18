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

export type ItemsType = 'case' | 'treasure' | 'container' | 'souvenir package' | 'capsule';

export type ItemDescPropValues = {
  value: string;
  color?: string;
  type?: string;
};