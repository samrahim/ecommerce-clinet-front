import { type Product, type ProductDetailsQuery, type ProductDetailsQueryVariables, ProductDetailsDocument, } from "$lib/graphql/types";
import { client } from "$lib/graphqlClient";
import { writable, type Writable } from "svelte/store";


export interface State {
    product: Product | null | undefined;
    loading: boolean;
    error: string | null;
}
export const state: Writable<State> = writable({
    error: null,
    loading: true,
    product: undefined,
});
export const getProductDetails = async (id: string) => {


    // Set loading state to true before fetching the data
    state.update((state) => ({ ...state, loading: true, error: null }));

    let variable: ProductDetailsQueryVariables = {
        where: {
            id: id,
        },
    };

    try {
        const response = await client.request(ProductDetailsDocument, variable);
        const body: ProductDetailsQuery = response;

        if (body.products && body.products.edges) {
            const p = body.products.edges[0]?.node;
            console.log(p?.images?.length);


            // Update state with the fetched product data
            state.update((state) => ({
                ...state,
                loading: false,
                error: null,
                product: p,
            }));
        } else {
            // Handle case where no product is found
            state.update((state) => ({
                ...state,
                loading: false,
                error: 'Product not found',
                product: null,
            }));
        }
    } catch (error) {
        console.error("Error fetching product details", error);
        state.update((state) => ({
            ...state,
            loading: false,
            error: "error",
            product: null,
        }));
    }
};
