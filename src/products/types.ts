import { IOffsetPaginationQuery, SortQuery } from '../utils/types';

export interface IGetProductsQuery extends IOffsetPaginationQuery {
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
