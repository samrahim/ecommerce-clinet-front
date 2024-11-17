<script lang="ts">
    import { onMount } from "svelte";
    import "../app.css";
    import Navbarr from "./nav_bar.svelte";

    import "./style.css";
    import {
        fetchAllCategories,
        categoryStore,
        fetchProducts,
        paginationStore,
        next,
        pageSize,
        categoryClicked,
        previous,
        selectedCategory,
        selectedProduct,
        AddTocart,
    } from "./store";
    import { writable } from "svelte/store";
    import type { Product, ProductEdge } from "$lib/graphql/types";
    import { goto } from "$app/navigation";

    onMount(() => {
        fetchAllCategories();
    });
</script>

<!-- <slot /> -->
<!-- <Navbarr></Navbarr> -->

<div class="navbar bg-base-100">
    <div class="flex-1">
        <img
            src=".\src\assets\download.png"
            alt="alt"
            height="40vh"
            width="40vh"
        />
        <div class="flex-2">
            <span>My store</span>
        </div>
    </div>
    <a href="/cart" class="flex-none">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
            <div class="indicator">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>
                <span class="badge badge-sm indicator-item"
                    >{$selectedProduct?.length}</span
                >
            </div>
        </div>
    </a>
</div>
<label class="input input-bordered flex items-center gap-2">
    <input type="text" class="grow" placeholder="Search" />
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        class="h-4 w-4 opacity-70"
    >
        <path
            fill-rule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clip-rule="evenodd"
        />
    </svg>
</label>
<div class="flex flex-row w-full overflow-auto gap-2 p-4">
    {#if $categoryStore.data}
        {#each $categoryStore.data?.categories?.edges || [] as item}
            {#if $selectedCategory == item?.node?.id}
                <button
                    class="btn btn-primary"
                    on:click={() => categoryClicked(item?.node?.id)}
                >
                    {item?.node?.name}
                </button>
            {:else}
                <button
                    class="btn btn-active"
                    on:click={() => categoryClicked(item?.node?.id)}
                >
                    {item?.node?.name}
                </button>
            {/if}
        {/each}
    {/if}
</div>

<div class="layout">
    {#each $paginationStore.data?.products.edges || [] as product}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            class="card card-compact bg-base-100 w-96 shadow-xl"
            on:click={() => goto(`./details/${product?.node?.id}`)}
        >
            <figure>
                <img
                    src={product?.node?.images && product.node.images[0]
                        ? `http://localhost:8081/files/${product.node.images[0]}`
                        : ""}
                    width="100%"
                    height="20vh"
                    alt="alt-img"
                    class="product-img"
                />
            </figure>
            <div class="card-body">
                <h2 class="card-title truncate">{product?.node?.name}</h2>

                <div class="product-price-discount">
                    <div class="price-wrapper">
                        {#if product?.node?.discounts?.length === 0}
                            <span class="init-price">
                                {product?.node?.price} DZ
                            </span>
                        {:else}
                            {#each product?.node?.discounts || [] as discount}
                                <span class="product-init-price">
                                    {product?.node?.price} DZ
                                </span>

                                <span class="product-discount-price">
                                    {product?.node?.price
                                        ? product.node.price -
                                          (discount?.value || 0)
                                        : 0} DZ
                                </span>
                            {/each}
                        {/if}
                    </div>
                </div>
                <div class="card-actions justify-end">
                    <button
                        class="swap-on"
                        on:click={() => AddTocart(product?.node?.id)}
                    >
                        ❤
                    </button>
                </div>
            </div>
        </div>
    {/each}
</div>

{#if $paginationStore.data && $paginationStore.data.products.edges && $paginationStore.data.products.edges.length > 0}
    <div class="flex space-x-3 rtl:space-x-reverse justify-center">
        {#if $paginationStore.pageInfo?.hasPreviousPage}
            <!-- <PaginationItem large class="flex items-center" on:click={previous}>
            <ArrowLeftOutline class="me-2 w-5 h-5" />
            Previous
          </PaginationItem>
        {/if}
        {#if $paginationStore.pageInfo?.hasNextPage}
          <PaginationItem large class="flex items-center" on:click={next}>
            Next
            <ArrowRightOutline class="ms-2 w-5 h-5" />
          </PaginationItem> -->
        {/if}
    </div>
{/if}

<style>
    .layout {
        width: 100vw; /* La mise en page occupe toute la largeur de l'écran */
        display: grid;
        gap: 8px;
        grid-template-columns: repeat(
            2,
            1fr
        ); /* Par défaut : 2 colonnes (téléphones) */
    }

    .card {
        width: 100%;
        height: auto;
    }

    @media (min-width: 768px) {
        .layout {
            grid-template-columns: repeat(4, 1fr); /* Passe à 4 colonnes */
        }
    }
    .price-wrapper {
        display: flex; /* Aligne tout sur une seule ligne */
        align-items: center;
        gap: 8px; /* Espacement entre les prix */
        white-space: nowrap; /* Empêche le retour à la ligne */
    }

    .product-init-price {
        text-decoration: line-through;
        color: red;
        font-size: 1rem;
    }

    .product-discount-price {
        color: green;
        font-size: 1.2rem;
        font-weight: bold;
    }

    .init-price {
        font-size: 1.2rem;
        font-weight: bold;
        color: black;
    }
    .product-img {
        width: 100%; /* Make the image take up the full width of the container */
        height: 30vh; /* Set the height to 20% of the viewport height */
        object-fit: cover; /* Ensures the image covers the area without distortion */
        border-radius: 8px; /* Optional: Adds rounded corners */
    }
</style>
