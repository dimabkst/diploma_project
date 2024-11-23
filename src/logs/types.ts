import { IOffsetPaginationQuery } from '../utils/types';

export interface IGetLogsQuery extends IOffsetPaginationQuery {
  level?: string;
  status?: string;
  method?: string;
  base_url?: string;
}
