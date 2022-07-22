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
        supportedRefreshRates
    } from '../data/gameSettings';
    import { getAllDisplayScreens } from '../stores/displayScreens';
    import ConfirmHoi4Path from '../components/ConfirmHoi4Path.svelte';

    const { addNotification, removeNotification } = getNotificationsContext();

    let steamPath = api.getHoi4Path();
    let currentLocale = supportedLanguages.find((l) => l.key === $locale);
    let gameSettings = {
        displayMode: supportedGameDisplayModes[0].value ?? null,
        displayMonitor: $getAllDisplayScreens[0].id.toString() ?? null,
        screenResolution: '',
        vSync: false,
        refreshRate: '60',
        renderer: supportedGameRenderers[0].value ?? null,
        language: supportedGameLanguages[0].value ?? null
    };
    let refreshingDisplays = false;

    $: currentLocale && locale.set(currentLocale.key);
    $: if ('fullscreen' !== gameSettings.displayMode) {
        gameSettings.vSync = false;
    }
    $: if ('fullscreen' !== gameSettings.displayMode || true === gameSettings.vSync) {
        const allRefreshRates = getAllRefreshRatesForCurrentMonitor(gameSettings.displayMonitor);

        gameSettings.refreshRate = allRefreshRates[0].value;
    }
    $: gameSettings.displayMonitor, regulateRefreshRate();
    $: refreshRatesForCurrentMonitor = getAllRefreshRatesForCurrentMonitor(gameSettings.displayMonitor);
    $: gamePath = steamPath.game.path || '';

    function getAllRefreshRatesForCurrentMonitor(displayId: string) {
        const display = $getAllDisplayScreens.find((s) => displayId === s.id);

        return supportedRefreshRates.filter((r) => parseInt(r.value) <= display.displayFrequency);
    }

    function regulateRefreshRate() {
        const maxRefreshRate = getAllRefreshRatesForCurrentMonitor(gameSettings.displayMonitor)[0];

        gameSettings.refreshRate = Math.min(
            parseInt(gameSettings.refreshRate),
            parseInt(maxRefreshRate.value)
        ).toString();
    }

    async function handleScreenRefresh() {
        try {
            removeNotification('displays-refreshed');

            refreshingDisplays = true;
            await getAllDisplayScreens.update();

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

            api.logs().info(`Folder path changed to : ${path}`);
        } else {
            removeNotification('hoi4-select-path-error');
            addNotification({
                id: 'hoi4-select-path-error',
                text: $_('notification.select_hoi4_folder_path.error'),
                position: 'top-center',
                removeAfter: 5000,
                type: 'danger'
            });
        }
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
                <Select variant="outlined" bind:value={gameSettings.displayMode} label={$_('settings.display_mode')}>
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
                    bind:value={gameSettings.displayMonitor}
                    label={$_('settings.monitor')}
                >
                    {#each $getAllDisplayScreens as displayScreen, index}
                        <Option value={displayScreen.id}>{`${displayScreen.id} [${index}]`}</Option>
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
        {#if 'fullscreen' === gameSettings.displayMode}
            <div class="form-field" in:fly|local={{ x: -200, duration: 300 }} out:fly|local={{ x: 200, duration: 300 }}>
                <FormField>
                    <Switch bind:checked={gameSettings.vSync} />
                    <span slot="label">{$_('settings.vsync.description')}</span>
                </FormField>
            </div>
        {/if}
        {#if 'fullscreen' === gameSettings.displayMode && false === gameSettings.vSync}
            <div class="form-field" in:fly|local={{ x: -200, duration: 300 }} out:fly|local={{ x: 200, duration: 300 }}>
                <FormField>
                    <Select
                        variant="outlined"
                        bind:value={gameSettings.refreshRate}
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
        <div class="form-field">
            <FormField>
                <Select variant="outlined" bind:value={gameSettings.language} label={$_('settings.game_language')}>
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
                <Select variant="outlined" bind:value={gameSettings.renderer} label={$_('settings.renderer')}>
                    {#each supportedGameRenderers as supportedGameRenderer}
                        <Option value={supportedGameRenderer.value}>
                            {supportedGameRenderer.label}
                        </Option>
                    {/each}
                    <svelte:fragment slot="helperText">{$_('settings.renderer.description')}</svelte:fragment>
                </Select>
            </FormField>
        </div>
        <div class="save-button">
            <Button variant="raised">
                <Label>{$_('settings.game_settings.save')}</Label>
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

    .save-button {
        padding-bottom: 2rem;
    }
</style>
