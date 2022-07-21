<script lang="ts">
    import Notifications from 'svelte-notifications';
    import Tab, { Label } from '@smui/tab';
    import TabBar from '@smui/tab-bar';
    import { isLoading, _ } from 'svelte-i18n';

    import { tabs } from './lib/data/tabs';

    let activeTab = tabs[0];
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
