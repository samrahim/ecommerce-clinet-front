import {
    type CategoriesQuery,
    CategoriesDocument,
    type CategoriesQueryVariables,
    type Category,
    type Maybe,
    type UpdateCategoryInput,
} from "$lib/graphql/types";
import { client } from "$lib/graphqlClient";
import type { PaginatedData, Query } from "$lib/helper";
import { get, writable, type Writable } from "svelte/store";

export const subCategorySearchQuery: Writable<string> = writable("");
export const categoryPageSize: number = 10;

export const query: Writable<Query> = writable({
    first: categoryPageSize,
});

// Initial store state
const initialState: PaginatedData<CategoriesQuery> = {
    data: null,
    pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
    },
    loading: false,
    error: null,
};

// Create a writable store using the interface
export const paginationStore =
    writable<PaginatedData<CategoriesQuery>>(initialState);
export const subCategorySearchStore =
    writable<PaginatedData<CategoriesQuery>>(initialState);

export const previous = () => {
    let storeState = get(paginationStore);
    if (storeState.pageInfo?.hasPreviousPage) {
        query.update((_) => ({
            last: categoryPageSize,
            before: storeState.pageInfo?.startCursor,
        }));
    }
};

export const next = () => {
    let storeState = get(paginationStore);
    if (storeState.pageInfo?.hasNextPage) {
        query.update((_) => ({
            first: categoryPageSize,
            after: storeState.pageInfo?.endCursor,
        }));
    }
};

paginationStore.update((state) => ({ ...state, loading: true, error: null }));

export const fetchCategories = async (q: Query) => {
    paginationStore.update((state) => ({ ...state, loading: true, error: null }));

    try {
        const variable: CategoriesQueryVariables = {
            first: q.first,
            last: q.last,
            after: q.after,
            before: q.before,
        };
        const response: CategoriesQuery = await client.request(
            CategoriesDocument,
            variable
        );
        paginationStore.update((store) => ({
            ...store,
            data: response,
            pageInfo: response.categories.pageInfo,
            loading: false,
        }));
    } catch (error) {
        paginationStore.set({
            data: null,
            pageInfo: null,
            loading: false,
            error: "wlh ma3labali wech rani ndir",
        });
    }
};

query.subscribe((v) => {
    fetchCategories(v);
});

export function getSubCategories(children?: Maybe<Category[]> | undefined) {
    return children?.map((value) => value.name).join(",");
}

subCategorySearchQuery.subscribe(async (value) => {
    const variable: CategoriesQueryVariables = {
        first: 5,
        where: {
            nameContains: value,
        },
    };
    const response: CategoriesQuery = await client.request(
        CategoriesDocument,
        variable
    );
    subCategorySearchStore.update((store) => ({
        ...store,
        data: response,
        pageInfo: response.categories.pageInfo,
        loading: false,
    }));
});