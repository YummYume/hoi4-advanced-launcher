<script lang="ts">
    import Notifications from 'svelte-notifications';
    import Tab, { Label } from '@smui/tab';
    import TabBar from '@smui/tab-bar';
    import { isLoading, _ } from 'svelte-i18n';
    import { onMount } from 'svelte';

    import { tabs } from './lib/data/tabs';
    import { displayScreens } from './lib/stores/displayScreens';
    import { gameSettings } from './lib/stores/gameSettings';

    let activeTab = tabs[0];

    onMount(() => {
        displayScreens.load();
        gameSettings.load();
    });
</script>

{#if $isLoading}
    <span>Loading...</span>
{/if}
<header>
    <TabBar {tabs} let:tab bind:active={activeTab}>
        <Tab {tab}>
            <Label>{$_(`menu.${tab.key}`)}</Label>
        </Tab>
    </TabBar>
</header>
<main>
    <Notifications>
        <svelte:component this={activeTab.component} />
    </Notifications>
</main>

<style>
    main {
        display: flex;
        height: 100%;
        overflow: auto;
    }
</style>
