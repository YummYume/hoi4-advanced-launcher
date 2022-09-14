<script lang="ts">
    import MenuSurface from '@smui/menu-surface';
    import Textfield from '@smui/textfield';
    import List, { Item, Text } from '@smui/list';
    import IconButton, { Icon } from '@smui/icon-button';
    import { _ } from 'svelte-i18n';
    import Button from '@smui/button';

    import type { MenuSurfaceComponentDev } from '@smui/menu-surface';

    import SectionTitleUnderline from '../../SectionTitleUnderline.svelte';

    let surface: MenuSurfaceComponentDev;
    let newPlaysetName = '';
</script>

<div class="section">
    <div class="section-title">
        <span class="title">{$_('mods.title')}</span>
        <SectionTitleUnderline />
    </div>
    <div class="drawer-container">
        <aside class="drawer-menu">
            <div class="subheader">
                <h2>{$_('mods.playsets')}</h2>
                <IconButton class="material-icons no-margin" size="button" on:click={() => surface.setOpen(true)}>
                    add
                </IconButton>
                <MenuSurface bind:this={surface} anchorCorner="BOTTOM_LEFT">
                    <div style="margin: 1em; display: flex; flex-direction: column; align-items: flex-end;">
                        <Textfield bind:value={newPlaysetName} label="Name" />
                        <Button style="margin-top: 1em;" on:click={() => surface.setOpen(false)}>Submit</Button>
                    </div>
                </MenuSurface>
            </div>
            <div class="list-content">
                <List>
                    <Item href="javascript:void(0)" on:click={() => (clicked = 'Gray Kittens')}>
                        <Text>Gray Kittens</Text>
                    </Item>
                    <Item href="javascript:void(0)" on:click={() => (clicked = 'A Space Rocket')}>
                        <Text>A Space Rocket</Text>
                    </Item>
                    <Item href="javascript:void(0)" on:click={() => (clicked = '100 Pounds of Gravel')}>
                        <Text>100 Pounds of Gravel</Text>
                    </Item>
                    <Item href="javascript:void(0)" on:click={() => (clicked = 'All of the Shrimp')}>
                        <Text>All of the Shrimp</Text>
                    </Item>
                    <Item href="javascript:void(0)" on:click={() => (clicked = 'A Planet with a Mall')}>
                        <Text>A Planet with a Mall</Text>
                    </Item>
                    <Item href="javascript:void(0)" on:click={() => (clicked = 'A Planet with a Mall')}>
                        <Text>A Planet with a Mall</Text>
                    </Item>
                    <Item href="javascript:void(0)" on:click={() => (clicked = 'A Planet with a Mall')}>
                        <Text>A Planet with a Mall</Text>
                    </Item>
                    <Item href="javascript:void(0)" on:click={() => (clicked = 'A Planet with a Mall')}>
                        <Text>A Planet with a Mall</Text>
                    </Item>
                    <Item href="javascript:void(0)" on:click={() => (clicked = 'A Planet with a Mall')}>
                        <Text>A Planet with a Mall</Text>
                    </Item>
                    <Item href="javascript:void(0)" on:click={() => (clicked = 'A Planet with a Mall')}>
                        <Text>A Planet with a Mall</Text>
                    </Item>
                    <Item href="javascript:void(0)" on:click={() => (clicked = 'A Planet with a Mall')}>
                        <Text>A Planet with a Mall</Text>
                    </Item>
                    <Item href="javascript:void(0)" on:click={() => (clicked = 'A Planet with a Mall')}>
                        <Text>A Planet with a Mallllllllllllllllllllll teset test</Text>
                    </Item>
                    <Item href="javascript:void(0)" on:click={() => (clicked = 'A Planet with a Mall')}>
                        <Text>A Planet with a Mall</Text>
                    </Item>
                    <Item href="javascript:void(0)" on:click={() => (clicked = 'A Planet with a Mall')}>
                        <Text>A Planet with a Mall</Text>
                    </Item>
                    <Item href="javascript:void(0)" on:click={() => (clicked = 'A Planet with a Mall')}>
                        <Text>A Planet with a Mall</Text>
                    </Item>
                    <Item href="javascript:void(0)" on:click={() => (clicked = 'A Planet with a Mall')}>
                        <Text>A Planet with a Mall</Text>
                    </Item>
                    <Item href="javascript:void(0)" on:click={() => (clicked = 'A Planet with a Mall')}>
                        <Text>A Planet with a Mall</Text>
                    </Item>
                    <Item href="javascript:void(0)" on:click={() => (clicked = 'A Planet with a Mall')}>
                        <Text>A Planet with a Mall</Text>
                    </Item>
                    <Item href="javascript:void(0)" on:click={() => (clicked = 'A Planet with a Mall')}>
                        <Text>A Planet with a Mall</Text>
                    </Item>
                    <Item href="javascript:void(0)" on:click={() => (clicked = 'A Planet with a Mall')}>
                        <Text>A Planet with a Mall</Text>
                    </Item>
                </List>
            </div>
        </aside>
        <div class="drawer-content">
            <h3>Playset</h3>
        </div>
    </div>
</div>

<style>
    @import 'settings.css';
</style>
