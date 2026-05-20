export declare namespace API {
  interface MarketHashNameResponse {
    results: {
      market_name: string;
      market_hash_name: string;
      app_id: number;
      app_name: string;
      icon_url: string;
      market_type: string;
      listing_count: number;
      search_score: number;
    }[];
  }

  interface ItemListingResponse {
    listings: ItemListing[];
    total_count: number;
  }

  interface ItemListing {
    strSubtotal: string;
    description: ItemDescription;
  }

  type CSItemInfoResponse = (CSItemBuskets | CSItemQueryData)[];

  interface CSItemBuskets {
    buckets: {
      bucket_id: string;
      strPrice: string;
      filters: [string, string][];
    }[];
  }

  interface CSItemQueryData {
    queryData: string;
  }

  interface ItemDescription {
    market_hash_name: string;
    icon_url: string;
  }

  interface PriceResponse {
    success: boolean;
    data: PriceData;
  }

  interface PriceData {
    amtMaxBuyOrder: number;
    amtMinSellOrder: number;
  }
}
