<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { paginationStore, next } from "./store"; // Import your next function
    import Navbarr from "./nav_bar.svelte";

    import "./style.css";

    let scrollContainer: HTMLDivElement | null = null;

    const checkScrollBottom = () => {
        if (scrollContainer) {
            const { scrollTop, clientHeight, scrollHeight } = scrollContainer;

            if (scrollTop + clientHeight >= scrollHeight - 50) {
                next(); // Call your pagination next function
            }
        }
    };

    onMount(() => {
        if (scrollContainer) {
            // Add event listener for scroll
            scrollContainer.addEventListener("scroll", checkScrollBottom);
        }
    });

    onDestroy(() => {
        if (scrollContainer) {
            // Clean up event listener on destroy
            scrollContainer.removeEventListener("scroll", checkScrollBottom);
        }
    });
</script>

<slot />
<Navbarr></Navbarr>

<div class="home-main-div">
    {#if $paginationStore.data}
        <div class="scroll-container" bind:this={scrollContainer}>
            {#each $paginationStore.data?.categories?.edges || [] as item}
                <h4>{item?.node?.name}</h4>
            {/each}
        </div>
    {/if}
</div>

<style>
    .home-main-div {
        padding: 1rem;
    }

    .scroll-container {
        display: grid;
        grid-template-columns: repeat(5, 1fr); /* 5 items per row */
        gap: 2vw;
        justify-items: center;
        overflow-y: auto;
        max-height: 80vh;
        padding: 10px;
    }

    .scroll-container h4 {
        border: 0.8px solid grey;
        background-color: wheat;
        border-radius: 4px;
        text-align: center;
        padding: 12px;
        width: 100%;
        box-sizing: border-box;
    }
</style>
