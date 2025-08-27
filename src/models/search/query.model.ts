import { SortDirection } from "./sort-direction.enum";

export interface Query<T> {
    searchCriteria?: T;
    page: number;
    pageSize: number;
    sortMember: string;
    sortDirection: SortDirection;
}
