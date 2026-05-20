import type { currencyAssotiations } from './constants';

export interface IInit {
  appid: string;
  currency: keyof typeof currencyAssotiations;
  itemSellPrice: number;
  itemBuyPrice: number;
  prices: Price[];
  descriptions: Description[];
}

export interface QueryData {
  queries: Query[];
}

interface Query {
  state: State;
  queryKey: (QueryKey | number | string)[];
  queryHash: string;
}

interface QueryKey {
  appid: number;
  strItemName: string;
  filters: Filters;
  accessoryFilters: Filters;
  propertyFilters: Filters;
}

interface Filters {}

interface State {
  data: Data;
  dataUpdateCount: number;
  dataUpdatedAt: number;
  error: null;
  errorUpdateCount: number;
  errorUpdatedAt: number;
  fetchFailureCount: number;
  fetchFailureReason: null;
  fetchMeta: null;
  isInvalidated: boolean;
  status: string;
  fetchStatus: string;
}

interface Data {
  has_wallet?: boolean;
  user_country_code?: string;
  wallet_country_code?: string;
  wallet_state?: string;
  balance?: string;
  delayed_balance?: string;
  currency_code?: number;
  time_most_recent_txn?: number;
  most_recent_txnid?: string;
  has_wallet_in_other_regions?: boolean;
  other_regions?: any[];
  formatted_balance?: string;
  formatted_delayed_balance?: string;
  pages?: Page[];
  pageParams?: number[];
  property_schemas?: Propertyschema[];
  item_type?: number;
  id?: number;
  success?: number;
  visible?: boolean;
  name?: string;
  store_url_path?: string;
  appid?: number;
  type?: number | string;
  included_types?: any[];
  included_appids?: any[];
  is_free?: boolean;
  content_descriptorids?: number[];
  categories?: Categories;
  asset_url_format?: string;
  main_capsule?: string;
  small_capsule?: string;
  header?: string;
  page_background?: string;
  hero_capsule?: string;
  library_capsule?: string;
  library_capsule_2x?: string;
  library_hero?: string;
  library_hero_2x?: string;
  community_icon?: string;
  page_background_path?: string;
  raw_page_background?: string;
  _t?: number;
  v?: (V | V2 | V3 | number)[][][];
  classid?: string;
  instanceid?: string;
  currency?: boolean;
  background_color?: string;
  icon_url?: string;
  icon_url_large?: string;
  descriptions?: Description[];
  tradable?: boolean;
  actions?: any[];
  owner_descriptions?: any[];
  owner_actions?: any[];
  fraudwarnings?: any[];
  name_color?: string;
  market_name?: string;
  market_hash_name?: string;
  market_actions?: any[];
  commodity?: boolean;
  market_tradable_restriction?: number;
  market_marketable_restriction?: number;
  marketable?: boolean;
  tags?: Tag2[];
  sealed?: boolean;
  market_bucket_group_name?: string;
  market_bucket_group_id?: string;
  sealed_type?: number;
  ecurrency?: number;
  prices?: Price[];
  amtMaxBuyOrder?: number;
  amtMinSellOrder?: number;
  eCurrency?: number;
  cBuyOrders?: number;
  cSellOrders?: number;
  rgCompactBuyOrders?: number[];
  rgCompactSellOrders?: number[];
  version?: number;
  preference_state?: number;
  content_customization?: Contentcustomization;
  valve_analytics?: Valveanalytics;
  third_party_analytics?: Thirdpartyanalytics;
  third_party_content?: Thirdpartycontent;
  utm_enabled?: boolean;
}

interface Thirdpartycontent {
  youtube: boolean;
  vimeo: boolean;
  sketchfab: boolean;
  twitter: boolean;
}

interface Thirdpartyanalytics {
  google_analytics: boolean;
}

interface Valveanalytics {
  product_impressions_tracking: boolean;
}

interface Contentcustomization {
  recentapps: boolean;
}

export interface Price {
  time: number;
  price_median: number;
  purchases: number;
}

interface Tag2 {
  category: string;
  internal_name: string;
  localized_category_name: string;
  localized_tag_name: string;
  color?: string;
}

interface V3 {
  id: number;
  name: string;
  type: number;
  localized_label: string;
  hide_from_description: boolean;
}

interface V2 {
  id: number;
  name: string;
  type: number;
  float_min: number;
  float_max: number;
  localized_label: string;
  hide_from_description: boolean;
}

interface V {
  id: number;
  name: string;
  type: number;
  int_min: string;
  int_max: string;
  localized_label: string;
  hide_from_description: boolean;
}

interface Categories {
  supported_player_categoryids: number[];
  feature_categoryids: number[];
  controller_categoryids: any[];
}

interface Propertyschema {
  id: number;
  name: string;
  type: number;
  int_min?: string;
  int_max?: string;
  localized_label: string;
  hide_from_description: boolean;
  float_min?: number;
  float_max?: number;
}

interface Page {
  more: boolean;
  start: number;
  total_count: number;
  listings: Listing[];
  facets: Facet[];
}

interface Facet {
  tag: Tag;
  listings: number;
}

interface Tag {
  appid: number;
  category: string;
  internal_name: string;
  localized_category_name: string;
  localized_tag_name: string;
  color?: string;
}

interface Listing {
  listingid: string;
  unPrice: number;
  unFee: number;
  publisherFeeApp: number;
  publisherFeePct: number;
  eCurrency: number;
  strSubtotal: string;
  enhanced_appearances: any[];
  description: Description2;
  asset: Asset;
}

interface Asset {
  id: string;
  assetid: string;
  instanceid: string;
  classid: string;
  amount: number;
  appid: number;
  contextid: string;
  asset_properties: any[];
  accessory_properties: any[];
}

interface Description2 {
  appid: number;
  classid: string;
  instanceid: string;
  currency: boolean;
  background_color: string;
  icon_url: string;
  icon_url_large: string;
  descriptions: Description[];
  tradable: boolean;
  actions: any[];
  owner_descriptions: any[];
  owner_actions: any[];
  fraudwarnings: any[];
  name: string;
  name_color: string;
  type: string;
  market_name: string;
  market_hash_name: string;
  market_actions: any[];
  commodity: boolean;
  market_tradable_restriction: number;
  market_marketable_restriction: number;
  marketable: boolean;
  tags: any[];
  sealed: boolean;
  market_bucket_group_name: string;
  market_bucket_group_id: string;
  sealed_type: number;
}

export interface Description {
  type: string;
  value: string;
  name: string;
  color?: string;
}

export interface SubItem {
  market_hash_name: string;
  price: string;
  link: string;
  color: string | null;
  image: string;
}
