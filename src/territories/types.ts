import { IOffsetPaginationQuery, SortQuery } from '../utils/types';

export interface IGetTerritoriesQuery extends IOffsetPaginationQuery {
  search?: string;
  sort_name?: SortQuery;
}

export interface ICreateTerritoryPayload {
  name: string;
}
