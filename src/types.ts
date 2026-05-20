export type Quarters = '1' | '2' | '3' | '4';
export type TQuantityOfSales = { day: string; week: string; month: string; year: string };
type QuarterStats = {
  sum: number;
  count: number;
};
export type PricesByYear = Record<string, Record<Quarters, QuarterStats>>;
