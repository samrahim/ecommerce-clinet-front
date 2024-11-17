<script>
    import { onMount } from "svelte";
    import { getProductDetails, state } from "./store";
    import { page } from "$app/stores";
    let productID = "";

    $: productID = $page.params.productID;
    $: {
        if (productID) {
            getProductDetails(productID); // Call your API function whenever productID changes
        }
    }
    onMount(() => {
        if (productID) {
            getProductDetails(productID);
        }
    });
</script>

<div class="grid gap-4 w-[40vw] h-[80vh]">
    <div>
        <img
            class="h-[50vh] w-[40vw] rounded-lg"
            src={$state.product?.images && $state.product?.images[0]
                ? `http://localhost:8081/files/${$state.product?.images[0]}`
                : ""}
            alt="Featured"
        />
    </div>
    <div class="grid grid-cols-5 gap-1">
        {#if $state.product?.images}
            {#each $state.product?.images.slice(1, 5) as img}
                <div class="small">
                    <img
                        class="h-[20vh] rounded-lg"
                        src={`http://localhost:8081/files/${img}`}
                        alt="Product"
                    />
                </div>
            {/each}
        {/if}
    </div>
</div>

<style>
    .small {
        height: 30vh;
        object-fit: fill;
    }
</style>
