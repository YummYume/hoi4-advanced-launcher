<script lang="ts">
    import Tab, { Label } from '@smui/tab';
    import TabBar from '@smui/tab-bar';
    import { isLoading, _, locale } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import { Circle2 } from 'svelte-loading-spinners';
    import { fade } from 'svelte/transition';
    import { SvelteToast } from '@zerodevx/svelte-toast';
    import Badge from '@smui-extra/badge';

    import { tabs } from './lib/stores/tabs';
    import { currentTab } from './lib/stores/currentTab';
    import { loading } from './lib/stores/loading';
    import { displayScreens } from './lib/stores/displayScreens';
    import { gameSettings } from './lib/stores/gameSettings';
    import { launchParameters, launchParametersStrictMode } from './lib/stores/launchParameters';
    import { hoi4Path } from './lib/stores/hoi4Path';

    onMount(() => {
        displayScreens.load();
        gameSettings.load();
        hoi4Path.refresh();
    });

    $: handleLocaleChange($locale);
    $: handleLaunchParametersChange($launchParameters);
    $: handleLaunchParametersStrictModeChange($launchParametersStrictMode);
    $: appLoading = $isLoading || $loading;
    $: handleSettingsNotification(api.isValidHoi4Folder($hoi4Path ?? api.getHoi4Path()));
    $: $currentTab, tabs.setNotification($currentTab.key, false);

    async function handleLocaleChange(newLocale?: string) {
        if (newLocale) {
            try {
                await api.setLocale(newLocale);
            } catch (e) {
                api.logs().error(e);
            }
        }
    }

    async function handleLaunchParametersChange(newParameters?: string) {
        if (newParameters) {
            try {
                await api.setLaunchParameters(newParameters);
            } catch (e) {
                api.logs().error(e);
            }
        }
    }

    async function handleLaunchParametersStrictModeChange(newMode: boolean) {
        try {
            await api.setLaunchParametersStrictMode(newMode);
        } catch (e) {
            api.logs().error(e);
        }
    }

    function handleSettingsNotification(isValidHoi4Folder: boolean) {
        if (!isValidHoi4Folder) {
            tabs.setNotification('settings', true);
        }
    }
</script>

{#if appLoading}
    <div class="loading-overlay" transition:fade={{ delay: 500, duration: 500 }}>
        <Circle2 size="100" unit="px" />
    </div>
{/if}
<header>
    <TabBar tabs={$tabs} disabled={appLoading} let:tab bind:active={$currentTab}>
        <Tab {tab} disabled={appLoading}>
            <Label>
                <div class="tab-label">
                    {$_(`menu.${tab.key}`)}
                    {#if tab.hasNotification}
                        <Badge
                            position="outset"
                            aria-label={$_(`badge.tabs.${tab.key}`)}
                            style="min-height: 10px; min-width: 10px; padding: 0;"
                        />
                    {/if}
                </div>
            </Label>
        </Tab>
    </TabBar>
</header>
<main>
    <svelte:component this={$currentTab.component} />
</main>
<SvelteToast options={{ duration: 5000, pausable: true, reversed: true, theme: { '--toastBarBackground': '#fff' } }} />

<style>
    main {
        display: flex;
        height: 100%;
        overflow: auto;
    }

    .loading-overlay {
        z-index: 9999;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .tab-label {
        position: relative;
    }

    :global(.info) {
        --toastBackground: rgb(10, 41, 143);
    }
    :global(.success) {
        --toastBackground: green;
    }
    :global(.warning) {
        --toastBackground: rgb(102, 102, 7);
    }
    :global(.error) {
        --toastBackground: red;
    }
</style>
