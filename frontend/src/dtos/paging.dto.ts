export type Paging = {
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: string,
    search: string
    category?: string | null
    maxPrice?: number | null
    minPrice?: number | null
}