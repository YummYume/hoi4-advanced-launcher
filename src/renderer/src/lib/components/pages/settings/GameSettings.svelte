<script lang="ts">
    import { _ } from 'svelte-i18n';
    import Select, { Option } from '@smui/select';
    import FormField from '@smui/form-field';
    import Switch from '@smui/switch';
    import { fly } from 'svelte/transition';
    import IconButton from '@smui/icon-button';
    import Tooltip, { Wrapper, Content as TooltipContent } from '@smui/tooltip';
    import { toast } from '@zerodevx/svelte-toast';

    import SectionTitleUnderline from '../../SectionTitleUnderline.svelte';
    import {
        supportedGameDisplayModes,
        supportedGameLanguages,
        supportedGameRenderers,
        supportedRefreshRates,
        supportedScreenResolutions
    } from '../../../data/gameSettings';
    import { displayScreens } from '../../../stores/displayScreens';
    import { gameSettings } from '../../../stores/gameSettings';

    let currentGameSettings = $gameSettings;
    let refreshingDisplays = false;
    let justPassingBy = true;

    $: currentGameSettings, justPassingBy ? (justPassingBy = false) : handleSettingsSave();
    $: if ('fullscreen' !== currentGameSettings.Graphics.display_mode.value) {
        currentGameSettings.Graphics.vsync.enabled = false;
    }
    $: if (
        'fullscreen' !== currentGameSettings.Graphics.display_mode.value ||
        true === currentGameSettings.Graphics.vsync.enabled
    ) {
        const allRefreshRates = getAllRefreshRatesForCurrentMonitor(currentGameSettings.Graphics.display_index.value);

        currentGameSettings.Graphics.refreshRate.value = allRefreshRates.at(0).value;
    }
    $: refreshRatesForCurrentMonitor = getAllRefreshRatesForCurrentMonitor(
        currentGameSettings.Graphics.display_index.value
    );
    $: resolutionsForCurrentMonitor = getAllResolutionsForCurrentMonitor(
        currentGameSettings.Graphics.display_index.value
    );
    $: currentGameSettings.Graphics.display_index.value, regulateRefreshRate();
    $: currentGameSettings.Graphics.display_index.value, regulateResolution();

    function getAllRefreshRatesForCurrentMonitor(displayIndex: string) {
        if (!$displayScreens.length) {
            return supportedRefreshRates;
        }

        const display = $displayScreens.at(parseInt(displayIndex));

        return supportedRefreshRates.filter((r) => parseInt(r.value) <= display.displayFrequency);
    }

    function getAllResolutionsForCurrentMonitor(displayIndex: string) {
        if (!$displayScreens.length) {
            return supportedScreenResolutions;
        }

        const display = $displayScreens.at(parseInt(displayIndex));

        return supportedScreenResolutions.filter((r) => {
            const widthAndHeight = r.label.split('x');
            const width = parseInt(widthAndHeight.at(0));
            const height = parseInt(widthAndHeight.at(1));

            return display.size.width >= width && display.size.height >= height;
        });
    }

    function regulateRefreshRate() {
        const maxRefreshRate = refreshRatesForCurrentMonitor.at(0);

        currentGameSettings.Graphics.refreshRate.value = Math.min(
            parseInt(currentGameSettings.Graphics.refreshRate.value),
            parseInt(maxRefreshRate.value)
        ).toString();
    }

    function regulateResolution() {
        const maxResolution = resolutionsForCurrentMonitor.at(0).value;
        const maxResolutionWidth = maxResolution.split('x').at(0);
        const maxResolutionHeight = maxResolution.split('x').at(1);
        const fullscreenResolution = currentGameSettings.Graphics.fullscreen_resolution.value.split('x');
        const fullscreenResolutionWidth = fullscreenResolution.at(0);
        const fullscreenResolutionHeight = fullscreenResolution.at(1);
        const windowedResolution = currentGameSettings.Graphics.windowed_resolution.value.split('x');
        const windowedResolutionWidth = windowedResolution.at(0);
        const windowedResolutionHeight = windowedResolution.at(1);

        if (
            parseInt(fullscreenResolutionWidth) > parseInt(maxResolutionWidth) ||
            parseInt(fullscreenResolutionHeight) > parseInt(maxResolutionHeight)
        ) {
            currentGameSettings.Graphics.fullscreen_resolution.value = maxResolution;
        }

        if (
            parseInt(windowedResolutionWidth) > parseInt(maxResolutionWidth) ||
            parseInt(windowedResolutionHeight) > parseInt(maxResolutionHeight)
        ) {
            currentGameSettings.Graphics.fullscreen_resolution.value = maxResolution;
        }
    }

    async function handleScreenRefresh() {
        try {
            refreshingDisplays = true;
            await displayScreens.update();

            api.logs().info('Display list refreshed.');

            toast.push($_('notification.displays_refreshed.success'), { classes: ['info'] });
        } catch (e) {
            api.logs().error(e);

            toast.push($_('notification.displays_refreshed.error'), { classes: ['error'] });
        }

        refreshingDisplays = false;
    }

    async function handleSettingsSave() {
        try {
            await gameSettings.save();
            api.logs().info('Settings saved.');
        } catch (e) {
            api.logs().error(e);

            toast.push($_('notification.save_settings_status.error'), { classes: ['error'] });
        }
    }
</script>

<div class="section">
    <div class="section-title">
        <span class="title">{$_('settings.game_settings')}</span>
        <SectionTitleUnderline />
    </div>
    <div class="form-field">
        <FormField>
            <Select
                variant="outlined"
                bind:value={currentGameSettings.Graphics.display_mode.value}
                label={$_('settings.display_mode')}
            >
                {#each supportedGameDisplayModes as supportedGameDisplayMode}
                    <Option value={supportedGameDisplayMode.value}>
                        {$_(`settings.display_mode.${supportedGameDisplayMode.label}`)}
                    </Option>
                {/each}
                <svelte:fragment slot="helperText">{$_('settings.display_mode.description')}</svelte:fragment>
            </Select>
        </FormField>
    </div>
    <div class="form-field">
        <FormField>
            <Select
                disabled={refreshingDisplays}
                variant="outlined"
                bind:value={currentGameSettings.Graphics.display_index.value}
                label={$_('settings.monitor')}
            >
                {#each $displayScreens as displayScreen, index}
                    <Option value={index.toString()}>{`${displayScreen.id} [${index}]`}</Option>
                {/each}
                <svelte:fragment slot="helperText">{$_('settings.monitor.description')}</svelte:fragment>
            </Select>
            <Wrapper>
                <IconButton
                    disabled={refreshingDisplays}
                    class="material-icons"
                    on:click={() => handleScreenRefresh()}
                    touch
                    size="button"
                >
                    sync
                </IconButton>
                <Tooltip showDelay={1000} hideDelay={100}>
                    <TooltipContent>{$_('settings.monitor.refresh_list')}</TooltipContent>
                </Tooltip>
            </Wrapper>
        </FormField>
    </div>
    {#if 'fullscreen' === currentGameSettings.Graphics.display_mode.value}
        <div class="form-field" in:fly|local={{ x: -200, duration: 300 }} out:fly|local={{ x: 200, duration: 300 }}>
            <FormField>
                <Switch bind:checked={currentGameSettings.Graphics.vsync.enabled} />
                <span slot="label">{$_('settings.vsync.description')}</span>
            </FormField>
        </div>
    {/if}
    {#if 'fullscreen' === currentGameSettings.Graphics.display_mode.value && false === currentGameSettings.Graphics.vsync.enabled}
        <div class="form-field" in:fly|local={{ x: -200, duration: 300 }} out:fly|local={{ x: 200, duration: 300 }}>
            <FormField>
                <Select
                    variant="outlined"
                    bind:value={currentGameSettings.Graphics.refreshRate.value}
                    label={$_('settings.refresh_rate')}
                >
                    {#each refreshRatesForCurrentMonitor as refreshRate}
                        <Option value={refreshRate.value}>
                            {refreshRate.label}
                        </Option>
                    {/each}
                    <svelte:fragment slot="helperText">{$_('settings.refresh_rate.description')}</svelte:fragment>
                </Select>
            </FormField>
        </div>
    {/if}
    {#if 'windowed' === currentGameSettings.Graphics.display_mode.value}
        <div class="form-field" in:fly|local={{ x: -200, duration: 300 }} out:fly|local={{ x: 200, duration: 300 }}>
            <FormField>
                <Select
                    variant="outlined"
                    bind:value={currentGameSettings.Graphics.windowed_resolution.value}
                    label={$_('settings.windowed_resolution')}
                >
                    {#each resolutionsForCurrentMonitor as resolution}
                        <Option value={resolution.value}>
                            {resolution.label}
                        </Option>
                    {/each}
                    <svelte:fragment slot="helperText">{$_('settings.windowed_resolution.description')}</svelte:fragment
                    >
                </Select>
            </FormField>
        </div>
    {:else}
        <div class="form-field" in:fly|local={{ x: -200, duration: 300 }} out:fly|local={{ x: 200, duration: 300 }}>
            <FormField>
                <Select
                    variant="outlined"
                    bind:value={currentGameSettings.Graphics.fullscreen_resolution.value}
                    label={$_('settings.fullscreen_resolution')}
                >
                    {#each resolutionsForCurrentMonitor as resolution}
                        <Option value={resolution.value}>
                            {resolution.label}
                        </Option>
                    {/each}
                    <svelte:fragment slot="helperText"
                        >{$_('settings.fullscreen_resolution.description')}</svelte:fragment
                    >
                </Select>
            </FormField>
        </div>
    {/if}
    <div class="form-field">
        <FormField>
            <Select
                variant="outlined"
                bind:value={currentGameSettings.System.language.value}
                label={$_('settings.game_language')}
            >
                {#each supportedGameLanguages as supportedGameLanguage}
                    <Option value={supportedGameLanguage.value}>
                        {supportedGameLanguage.label}
                    </Option>
                {/each}
                <svelte:fragment slot="helperText">{$_('settings.game_language.description')}</svelte:fragment>
            </Select>
        </FormField>
    </div>
    <div class="form-field">
        <FormField>
            <Select
                variant="outlined"
                bind:value={currentGameSettings.Graphics.renderer.value}
                label={$_('settings.renderer')}
            >
                {#each supportedGameRenderers as supportedGameRenderer}
                    <Option value={supportedGameRenderer.value}>
                        {supportedGameRenderer.label}
                    </Option>
                {/each}
                <svelte:fragment slot="helperText">{$_('settings.renderer.description')}</svelte:fragment>
            </Select>
        </FormField>
    </div>
</div>

<style>
    @import 'settings.css';
</style>
