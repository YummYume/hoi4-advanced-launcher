<script lang="ts">
    import { fade } from 'svelte/transition';

    import Playsets from '../components/pages/mods/Playsets.svelte';
</script>

<section class="container" in:fade>
    <Playsets />
</section>

<style>
    .container {
        padding: 10px;
        display: flex;
        flex-direction: column;
        flex: 1;
    }
</style>
