import { IOffsetPaginationQuery, SortQuery } from '../utils/types';

export interface IGetProductsQuery extends IOffsetPaginationQuery {
  category_id?: string;
  category_ids?: number[];
  manufacturer_id?: string;
  manufacturer_ids?: number[];
  country_of_origin?: string;
  countries_of_origin?: string[];
  price_gte?: string;
  price_lte?: string;
  search?: string;
  sort_name?: SortQuery;
}

export interface ICreateProductPayload {
  name: string;
  price: number;
  active?: boolean;
  stock?: number;
  image?: string;
  countryOfOrigin?: string;
  description?: string;
  color?: string;
  weight?: string;
  size?: string;
  manufacturerId?: number;
  productCategoryId?: number;
}

export interface IUpdateProductPayload {
  name?: string;
  price?: number;
  active?: boolean;
  stock?: number;
  image?: string;
  countryOfOrigin?: string;
  description?: string;
  color?: string;
  weight?: string;
  size?: string;
  manufacturerId?: number;
  productCategoryId?: number;
}
