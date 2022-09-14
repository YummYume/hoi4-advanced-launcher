<script lang="ts">
    import { fade } from 'svelte/transition';

    import ModList from '../components/pages/mods/ModList.svelte';
</script>

<section class="container" in:fade>
    <ModList />
</section>

<style>
    .container {
        padding: 10px;
        display: flex;
        flex-direction: column;
        flex: 1;
    }
</style>
