<script lang="ts">
    import { onMount } from "svelte";

    import Navbarr from "./nav_bar.svelte";

    import "./style.css";
    import {
        fetchAllCategories,
        categoryStore,
        fetchProducts,
        paginationStore,
        next,
        pageSize,
    } from "./store";
    import { PaginationItem } from "flowbite-svelte";
    import { ArrowLeftOutline, ArrowRightOutline } from "flowbite-svelte-icons";

    onMount(() => {
        fetchAllCategories();
        // fetchProducts({ first: pageSize });
    });
</script>

<slot />
<Navbarr></Navbarr>
<main>
    <div class="home-main-div">
        {#if $categoryStore.data}
            <div class="scroll-container">
                {#each $categoryStore.data?.categories?.edges || [] as item}
                    <h6 class="category-item">{item?.node?.name}</h6>
                {/each}
            </div>
        {/if}
    </div>

    <div class="grid">
        {#each $paginationStore.data?.products.edges || [] as product}
            <div class="grid-item">
                <img
                    src={product?.node?.images && product.node.images[0]
                        ? `http://localhost:8081/files/${product.node.images[0]}`
                        : ""}
                    alt="alt-img"
                    class="product-img"
                />
                <div class="product-name">{product?.node?.name}</div>
                <div class="product-price-discount">
                    {#each product?.node?.discounts || [] as discount}
                        {#if discount?.active}
                            <div class="product-price">
                                {product?.node?.price
                                    ? product.node.price -
                                      (discount?.value || 0)
                                    : 0}
                            </div>
                        {/if}
                    {/each}
                </div>
            </div>
        {/each}
    </div>
    <div class="flex space-x-3 rtl:space-x-reverse justify-center">
        <PaginationItem large class="flex items-center">
            <ArrowLeftOutline class="me-2 w-5 h-5" />
            Previous
        </PaginationItem>
        <PaginationItem large class="flex items-center" on:click={next}>
            Next
            <ArrowRightOutline class="ms-2 w-5 h-5" />
        </PaginationItem>
    </div>
</main>

<style>
    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 20px;
    }

    .grid-item {
        background-color: #f9f9f9;
        padding: 8px;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .product-img {
        width: 100%;
        height: 20vh;
        border-radius: 8px;
    }

    .product-name {
        font-weight: bold;
        margin-top: 10px;
        font-size: 1.1em;
    }

    .product-price-discount {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 10px;
    }

    .product-price,
    .product-discount {
        font-size: 1.1em;
        font-weight: 600;
    }

    .product-discount {
        color: red;
    }
    .home-main-div {
        padding: 1rem;
    }

    .scroll-container {
        display: flex;
        gap: 2vw;
        overflow-x: auto;
        max-width: 100%;
        -webkit-overflow-scrolling: touch;
    }

    .scroll-container::-webkit-scrollbar {
        display: none;
    }

    .category-item {
        border: 0.8px solid grey;
        background-color: white;
        border-radius: 4px;
        text-align: center;
        padding: 8px;
        min-width: 120px;
        box-sizing: border-box;
    }

    @media (max-width: 767px) {
        .category-item {
            min-width: 90px;
        }
    }
</style>
