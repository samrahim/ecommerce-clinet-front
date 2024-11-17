import {
  type CategoriesQuery,
  CategoriesDocument,
  type ProductsQueryVariables,
  type ProductsQuery,
  ProductsDocument,
  type ProductWhereInput,
  type CategoryEdge,
  type Product,
  type ProductEdge,
} from "$lib/graphql/types";
import { client } from "$lib/graphqlClient";
import type { PaginatedData } from "$lib/helper";
import { get, writable, type Writable } from "svelte/store";
import { id } from "svelty-picker/i18n";
interface RequestState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
type CategoriesState = RequestState<CategoriesQuery>;

const initialCategoriesState: CategoriesState = {
  data: null,
  loading: false,
  error: null,
};

export const categoryStore = writable<CategoriesState>(initialCategoriesState);

export const selectedCategory = writable<String | undefined>();

export const fetchAllCategories = async () => {
  categoryStore.update((state) => ({ ...state, loading: true, error: null }));

  try {
    const response: CategoriesQuery = await client.request(CategoriesDocument);
    categoryStore.update(() => ({
      data: response,
      loading: false,
      error: null,
    }));
  } catch (error) {
    categoryStore.update(() => ({
      data: null,
      loading: false,
      error: "Error fetching categories.",
    }));
  }
};

export const pageSize: number = 10;
export const filterModal: Writable<boolean> = writable(false);

export const query: Writable<ProductsQueryVariables> = writable({
  first: pageSize,
});

// Initial store state
const initialState: PaginatedData<ProductsQuery> = {
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
  writable<PaginatedData<ProductsQuery>>(initialState);

export const previous = () => {
  let storeState = get(paginationStore);
  if (storeState.pageInfo?.hasPreviousPage) {
    query.update((s) => ({
      last: pageSize,
      before: storeState?.pageInfo?.startCursor,
    }));
  }
};

export const next = () => {
  let storeState = get(paginationStore);
  if (storeState.pageInfo?.hasNextPage) {
    query.update((s) => ({
      first: pageSize,
      after: storeState?.pageInfo?.endCursor,
    }));
  }
};





categoryStore.subscribe((state) => {
  let where: ProductWhereInput = {};
  if (state.loading == false && state.data && state.error == null) {
    if (state.data.categories.edges && state.data.categories.edges.length > 0) {
      let c = state.data.categories.edges[0];
      if (c && c.node) {
        where = {
          hasCategoryWith: [
            {
              id: c?.node?.id,
            },
          ],
        };
      }
    }
    query.update((s) => ({ ...s, first: pageSize, where: where }));
  }
});

export const fetchProducts = async (variable: ProductsQueryVariables) => {


  paginationStore.update((state) => ({ ...state, loading: true, error: null }));
  try {
    const response = await client.request(ProductsDocument, variable);
    const data: ProductsQuery = response;
    data.products.edges;
    paginationStore.update((store) => ({
      ...store,
      data: response,
      pageInfo: response.products.pageInfo,
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

query.subscribe((q) => {

  fetchProducts(q);
});

export const categoryClicked = (itemID: string | undefined) => {


  selectedCategory.set(itemID);
  if (!itemID) {
    return;
  }
  query.update((s) => {
    s.where = {
      hasCategoryWith: [{ id: itemID }],
    };
    return s;
  });
};

export const selectedProduct = writable<string[]>([]);

export const AddTocart = (productID: string | undefined) => {

  if (!productID) {
    return;
  }
  else {
    selectedProduct.update((current) => {


      if (!current.includes(productID)) {
        return [...current, productID];
      } else {
        return current.filter((product) => product !== productID);
      }
    });
  }
}
