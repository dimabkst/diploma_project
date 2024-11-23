import { IOffsetPaginationQuery, SortQuery } from '../utils/types';

export interface IGetLogsQuery extends IOffsetPaginationQuery {
  level?: string;
  status?: string;
  method?: string;
  base_url?: string;
  sort_date?: SortQuery;
  sort_status?: SortQuery;
}
