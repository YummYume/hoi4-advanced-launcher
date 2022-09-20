<script lang="ts">
    import { onMount } from 'svelte';
    import { slide } from 'svelte/transition';
    import MenuSurface from '@smui/menu-surface';
    import Textfield from '@smui/textfield';
    import List, { Item, Text } from '@smui/list';
    import IconButton from '@smui/icon-button';
    import Tab, { Label } from '@smui/tab';
    import TabBar from '@smui/tab-bar';
    import { _ } from 'svelte-i18n';
    import Button from '@smui/button';
    import { toast } from '@zerodevx/svelte-toast';

    import type { MenuSurfaceComponentDev } from '@smui/menu-surface';

    import SectionTitleUnderline from '../../SectionTitleUnderline.svelte';
    import { currentModsTab } from '../../../stores/currentModsTab';
    import { playsets, currentPlayset, defaultPlayset, Playset } from '../../../stores/playsets';
    import ModList from './ModList.svelte';

    let surface: MenuSurfaceComponentDev;
    let newPlayset = {
        name: '',
        description: ''
    };
    let fetchingPlayset = false;

    $: defaultPlaysetSelected = $currentPlayset.id === defaultPlayset.id;

    onMount(async () => {
        try {
            await playsets.init();
        } catch (e) {
            api.logs().error(e);

            toast.push($_('notification.playset.error'), { dismissable: false, initial: 0 });
        }
    });

    async function handleNewPlayset() {
        fetchingPlayset = true;
        const addToast = toast.push($_('notification.playset.add'), { dismissable: false, initial: 0 });

        try {
            await playsets.add(newPlayset);

            toast.set(addToast, {
                msg: $_('notification.playset.add.success', { values: { name: newPlayset.name } }),
                dismissable: true,
                classes: ['success'],
                next: 1
            });
        } catch (e) {
            api.logs().error(e);

            toast.set(addToast, {
                msg: $_('notification.playset.add.error'),
                dismissable: true,
                classes: ['error'],
                initial: 1,
                next: 1
            });
        }

        surface.setOpen(false);
        newPlayset = {
            name: '',
            description: ''
        };
        fetchingPlayset = false;
    }

    async function updatePlayset(playset: Playset): Promise<void> {
        await playsets.update(playset.id, { name: 'New name' });
    }

    async function removePlayset(playset: Playset): Promise<void> {
        await playsets.remove(playset.id);
    }
</script>

<div class="section">
    <div class="section-title">
        <span class="title">{$_('mods.title')}</span>
        <SectionTitleUnderline />
    </div>
    <div class="section-tabs">
        <TabBar tabs={['mods', 'dlc']} let:tab bind:active={$currentModsTab}>
            <Tab {tab} tabIndicator$type="icon" tabIndicator$content$class="material-icons">
                <Label>{tab}</Label>
                <svelte:fragment slot="tab-indicator">{tab === 'mods' ? 'star' : 'add'}</svelte:fragment>
            </Tab>
        </TabBar>
    </div>
    <div class="drawer-container">
        <aside class="drawer-menu">
            <div class="subheader">
                <h2>{$_('mods.playsets')}</h2>
                <IconButton class="material-icons no-margin" size="button" on:click={() => surface.setOpen(true)}>
                    add
                </IconButton>
                <MenuSurface bind:this={surface} anchorCorner="BOTTOM_END">
                    <div class="menu-surface">
                        <Textfield variant="outlined" bind:value={newPlayset.name} label={$_('playset.title')} />
                        <Textfield
                            variant="outlined"
                            textarea
                            bind:value={newPlayset.description}
                            label={$_('playset.description')}
                        />
                        <Button disabled={'' === newPlayset.name || fetchingPlayset} on:click={handleNewPlayset}>
                            {$_('common.add')}
                        </Button>
                    </div>
                </MenuSurface>
            </div>
            <div class="list-content">
                <List>
                    <Item on:click={() => currentPlayset.set(defaultPlayset)} selected={defaultPlaysetSelected}>
                        <Text>{$_('common.default')}</Text>
                    </Item>
                    {#each $playsets as playset}
                        <div transition:slide|local>
                            <Item
                                on:click={() => currentPlayset.set(playset)}
                                selected={$currentPlayset?.id === playset.id}
                            >
                                <Text>{playset.name}</Text>
                            </Item>
                        </div>
                    {/each}
                </List>
            </div>
        </aside>
        <div class="drawer-content">
            <ModList
                bind:playset={$currentPlayset}
                {updatePlayset}
                {removePlayset}
                isDefault={defaultPlaysetSelected}
            />
        </div>
    </div>
</div>

<style>
    @import 'playsets.css';

    .menu-surface {
        padding: 0.5rem;
        min-width: 200px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style>
