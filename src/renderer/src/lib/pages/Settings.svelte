<script lang="ts">
    import { fade } from 'svelte/transition';

    import GameSettings from '../components/pages/settings/GameSettings.svelte';
    import LauncherOptions from '../components/pages/settings/LauncherOptions.svelte';
    import LauncherSettings from '../components/pages/settings/LauncherSettings.svelte';
</script>

<section class="container" in:fade>
    <LauncherSettings />
    <GameSettings />
    <LauncherOptions />
</section>

<style>
    .container {
        padding: 10px;
        display: flex;
        flex-direction: column;
        flex: 1;
    }
</style>
