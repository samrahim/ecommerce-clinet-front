<script lang="ts">
    import { onMount, type ComponentType } from "svelte";
    import Navbarr from "./nav_bar.svelte";

    import "./style.css";
    import { categoryPageSize, fetchCategories } from "./store";
    onMount(() => {
        fetchCategories({ first: categoryPageSize });
    });
</script>

<Navbarr></Navbarr>

<div class="home-main-div"></div>
