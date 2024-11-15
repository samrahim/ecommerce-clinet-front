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
  } from "./store";
  onMount(() => {
    fetchAllCategories();
  });
</script>

<!-- <slot /> -->
<!-- <Navbarr></Navbarr> -->
<div class="flex flex-row w-full overflow-auto gap-2 p-4">
  {#if $categoryStore.data}
    {#each $categoryStore.data?.categories?.edges || [] as item}
      {#if $selectedCategory == item?.node?.id}
        <button
          class="btn btn-outline btn-success"
          on:click={() => categoryClicked(item?.node?.id)}
        >
          {item?.node?.name}
        </button>
      {:else}
        <button
          class="btn btn-outline"
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
    <div class="card bg-base-100 w-48 shadow-xl">
      <figure>
        <img
          src="http://localhost:8081/files/1731700642_file-1.png"
          alt="alt-img"
          class="product-img"
          loading="lazy"
        />
      </figure>
      <div class="card-body">
        <h2 class="card-title truncate">{product?.node?.name}</h2>
        <div class="card-actions justify-end">
          <button class="btn btn-primary">Buy Now</button>
        </div>
      </div>
      <!-- <div class="product-price-discount">
            {#each product?.node?.discounts || [] as discount}
              {#if discount?.active}
                <div class="product-price">
                  {product?.node?.price
                    ? product.node.price - (discount?.value || 0)
                    : 0}
                </div>
              {/if}
            {/each}
          </div> -->
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
    width: 100%;
    display: grid;
    grid-template-rows: repeat(auto-fit, 300px);
    grid-template-columns: repeat(auto-fit, 240px);
    gap: 8px;
  }
</style>
