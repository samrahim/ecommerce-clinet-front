import type { PageInfo } from "./graphql/types";

export interface PaginatedData<T> {
    data: T | null; // Array of data items, generic type T for flexibility
    pageInfo: PageInfo | null; // Metadata about pagination
    loading: boolean; // Loading state
    error: string | null;
}

export interface Query {
    first?: number | undefined;
    last?: number | undefined;
    after?: string | null | undefined;
    before?: string | null | undefined;
}
