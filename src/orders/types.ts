import { IOffsetPaginationQuery, SortQuery } from '../utils/types';

export interface IGetOrdersQuery extends IOffsetPaginationQuery {
  sort_by_order_date?: SortQuery;
}
