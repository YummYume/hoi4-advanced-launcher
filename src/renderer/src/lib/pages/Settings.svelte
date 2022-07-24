<script lang="ts">
    import Autocomplete from '@smui-extra/autocomplete';
    import { _, locale } from 'svelte-i18n';
    import { fade } from 'svelte/transition';
    import Select, { Option } from '@smui/select';
    import FormField from '@smui/form-field';
    import Button, { Label } from '@smui/button';
    import Switch from '@smui/switch';
    import Textfield from '@smui/textfield';
    import { fly } from 'svelte/transition';
    import { getNotificationsContext } from 'svelte-notifications';
    import { dialogs } from 'svelte-dialogs';
    import IconButton from '@smui/icon-button';

    import SectionTitleUnderline from '../components/SectionTitleUnderline.svelte';
    import { supportedLanguages } from '../data/languages';
    import {
        supportedGameDisplayModes,
        supportedGameLanguages,
        supportedGameRenderers,
        supportedRefreshRates,
        supportedScreenResolutions
    } from '../data/gameSettings';
    import { displayScreens } from '../stores/displayScreens';
    import ConfirmHoi4Path from '../components/ConfirmHoi4Path.svelte';
    import { gameSettings } from '../stores/gameSettings';

    const { addNotification, removeNotification } = getNotificationsContext();

    let steamPath = api.getHoi4Path();
    let currentLocale = supportedLanguages.find((l) => l.key === $locale);
    let currentGameSettings = $gameSettings;
    let savedGameSettings = { ...currentGameSettings };
    let refreshingDisplays = false;

    $: currentLocale && locale.set(currentLocale.key);
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
    $: gamePath = steamPath ?? '';
    $: currentGameSettings, handleSettingsSave();

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
            removeNotification('displays-refreshed');

            refreshingDisplays = true;
            await displayScreens.update();

            api.logs().info('Display list refreshed.');

            addNotification({
                id: 'displays-refreshed',
                text: $_('notification.displays_refreshed.success'),
                position: 'top-center',
                removeAfter: 5000,
                type: 'success'
            });
        } catch (e) {
            api.logs().error(e);

            addNotification({
                id: 'displays-refreshed',
                text: $_('notification.displays_refreshed.error'),
                position: 'top-center',
                removeAfter: 5000,
                type: 'danger'
            });
        }

        refreshingDisplays = false;
    }

    async function handleFolderPathSelect() {
        const path = await api.folderPathInput();

        if (api.isValidHoi4Folder(path)) {
            const confirm = await dialogs.modal(ConfirmHoi4Path, { path });

            if (confirm) {
                api.logs().info(`Folder path changed to : ${path}`);

                addNotification({
                    id: 'hoi4-select-path-success',
                    text: $_('notification.select_hoi4_folder_path.success'),
                    position: 'top-center',
                    removeAfter: 5000,
                    type: 'success'
                });
            }
        } else {
            removeNotification('hoi4-select-path-error');
            addNotification({
                id: 'hoi4-select-path-error',
                text: $_('notification.select_hoi4_folder_path.invalid'),
                position: 'top-center',
                removeAfter: 5000,
                type: 'danger'
            });
        }
    }

    async function handleSettingsSave() {
        removeNotification('hoi4-save-settings-status');

        try {
            await gameSettings.save();
            api.logs().info('Settings saved.');

            savedGameSettings = { ...currentGameSettings };
        } catch (e) {
            api.logs().error(e);

            addNotification({
                id: 'hoi4-save-settings-status',
                text: $_('notification.save_settings_status.error'),
                position: 'top-center',
                removeAfter: 5000,
                type: 'error'
            });
        }
    }

    async function handleLogsFolderOpen() {
        await api.openLogsFolder();
    }
</script>

<section class="container" in:fade>
    <div class="section">
        <div class="section-title">
            <span class="title">{$_('settings.launcher')}</span>
            <SectionTitleUnderline />
        </div>
        <div class="form-field folder-select-container">
            <Button variant="raised" on:click={handleFolderPathSelect}>
                <Label>{$_('common.select')}</Label>
            </Button>
            <Textfield
                label={$_('settings.game_folder')}
                bind:value={gamePath}
                type="text"
                style="flex-grow: 1;"
                helperLine$style="flex-grow: 1;"
                disabled
            />
        </div>
        <div class="form-field">
            <FormField>
                <Autocomplete
                    options={supportedLanguages}
                    textfield$variant="outlined"
                    getOptionLabel={(option) => option.name}
                    bind:value={currentLocale}
                    label={$_('settings.language')}
                />
            </FormField>
        </div>
    </div>
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
                <IconButton
                    disabled={refreshingDisplays}
                    class="material-icons"
                    on:click={() => handleScreenRefresh()}
                    touch
                    size="button"
                >
                    sync
                </IconButton>
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
                        <svelte:fragment slot="helperText"
                            >{$_('settings.windowed_resolution.description')}</svelte:fragment
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
    <div class="section">
        <div class="section-title">
            <span class="title">{$_('settings.options')}</span>
            <SectionTitleUnderline />
        </div>
        <div class="form-field">
            <Button variant="raised" on:click={() => handleLogsFolderOpen()}>
                <Label>{$_('settings.options.open_logs')}</Label>
            </Button>
        </div>
    </div>
</section>

<style>
    .container {
        padding: 10px;
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    .folder-select-container {
        display: flex;
        align-items: center;
        column-gap: 10px;
    }

    .section-title {
        margin-bottom: 10px;
    }

    .title {
        font-size: 2rem;
    }

    .section {
        margin: 5px 10px;
    }

    .form-field {
        margin: 20px 0;
    }
</style>
