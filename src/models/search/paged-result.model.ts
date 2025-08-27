export interface PagedResult<T> {
    results: T[];
    page: number;
    pageSize: number;
    totalCount: number;
    pagesCount: number;
}
