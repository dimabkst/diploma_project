import { ICursorPaginationQuery, SortQuery } from '../utils/types';

export interface IGetTerritoriesQuery extends ICursorPaginationQuery {
  search?: string;
  sort_name?: SortQuery;
}

export interface ICreateTerritoryPayload {
  name: string;
}
