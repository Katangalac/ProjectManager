/**
 * Type représentant les informations de pagination
 */
export type Pagination = {
    page: number | "All",
    pageSize: number | "All",
    totalItems: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean
};