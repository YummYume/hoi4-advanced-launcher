<script lang="ts">
    import Autocomplete from '@smui-extra/autocomplete';
    import { _, locale } from 'svelte-i18n';
    import FormField from '@smui/form-field';
    import Button, { Label } from '@smui/button';
    import Textfield from '@smui/textfield';
    import { getNotificationsContext } from 'svelte-notifications';
    import { dialogs } from 'svelte-dialogs';
    import IconButton from '@smui/icon-button';
    import Tooltip, { Wrapper, Content as TooltipContent } from '@smui/tooltip';

    import SectionTitleUnderline from '../../../components/SectionTitleUnderline.svelte';
    import { supportedLanguages } from '../../../data/languages';
    import ConfirmHoi4Path from '../../../components/ConfirmHoi4Path.svelte';

    const { addNotification, removeNotification } = getNotificationsContext();

    let steamPath = api.getHoi4Path();
    let currentLocale = supportedLanguages.find((l) => l.key === $locale);

    $: if (currentLocale) {
        locale.set(currentLocale.key);
    }
    $: gamePath = steamPath ?? '';

    async function handleFolderPathSelect(auto = false) {
        removeNotification('hoi4-select-path-status');
        const path = auto ? api.findHoi4DirPath() : await api.folderPathInput();

        if (!path && !auto) {
            return;
        }

        if (api.isValidHoi4Folder(path)) {
            const confirm = await dialogs.modal(ConfirmHoi4Path, { path, auto });

            if (confirm) {
                try {
                    api.setHoi4DirPath(path);
                    api.logs().info(`Folder path changed to : ${path}`);

                    addNotification({
                        id: 'hoi4-select-path-status',
                        text: $_('notification.select_hoi4_folder_path.success'),
                        position: 'top-center',
                        removeAfter: 5000,
                        type: 'success'
                    });
                } catch (e) {
                    api.logs().error('Error while changing HOI4 dir path.');

                    addNotification({
                        id: 'hoi4-select-path-status',
                        text: $_('notification.select_hoi4_folder_path.error'),
                        position: 'top-center',
                        removeAfter: 5000,
                        type: 'warning'
                    });
                }
            }
        } else {
            addNotification({
                id: 'hoi4-select-path-status',
                text: $_(
                    auto
                        ? 'notification.select_hoi4_folder_path.not_found'
                        : 'notification.select_hoi4_folder_path.invalid'
                ),
                position: 'top-center',
                removeAfter: 5000,
                type: 'danger'
            });
        }
    }
</script>

<div class="section">
    <div class="section-title">
        <span class="title">{$_('settings.launcher')}</span>
        <SectionTitleUnderline />
    </div>
    <div class="form-field folder-select-container">
        <Button variant="raised" on:click={() => handleFolderPathSelect()}>
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
        <Wrapper>
            <IconButton class="material-icons" on:click={() => handleFolderPathSelect(true)} touch size="normal">
                auto_awesome
            </IconButton>
            <Tooltip showDelay={1000} hideDelay={100}>
                <TooltipContent>{$_('settings.game_folder.auto_find')}</TooltipContent>
            </Tooltip>
        </Wrapper>
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

<style>
    @import 'settings.css';
</style>
