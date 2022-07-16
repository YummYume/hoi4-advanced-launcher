<script lang="ts">
    import Notifications from 'svelte-notifications';
    import Tab, { Label } from '@smui/tab';
    import TabBar from '@smui/tab-bar';

    import { tabs } from './lib/data/tabs';

    let activeTab = tabs[0];
</script>

<header>
    <TabBar {tabs} let:tab bind:active={activeTab}>
        <Tab {tab}>
            <Label>{tab.label}</Label>
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
    }
</style>
