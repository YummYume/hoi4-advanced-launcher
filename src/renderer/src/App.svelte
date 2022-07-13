<script lang="ts">
    import Tab, { Label } from '@smui/tab';
    import TabBar from '@smui/tab-bar';

    import Home from './lib/pages/Home.svelte';
    import Settings from './lib/pages/Settings.svelte';
    import Conflicts from './lib/pages/Conflicts.svelte';
    import Mods from './lib/pages/Mods.svelte';

    const tabs = [
        { label: 'Home', component: Home },
        { label: 'Mods', component: Mods },
        { label: 'Conflicts', component: Conflicts },
        { label: 'Settings', component: Settings }
    ];

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
    <svelte:component this={activeTab.component} />
</main>
