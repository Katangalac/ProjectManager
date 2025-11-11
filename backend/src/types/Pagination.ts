/**
 * 
 */
export type Pagination = {
    page: number | "All",
    pageSize: number | "All",
    totalItems: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean
};