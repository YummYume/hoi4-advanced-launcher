<script lang="ts">
    import Autocomplete from '@smui-extra/autocomplete';
    import { _, locale } from 'svelte-i18n';
    import FormField from '@smui/form-field';
    import Button, { Label } from '@smui/button';
    import Textfield from '@smui/textfield';
    import { dialogs } from 'svelte-dialogs';
    import IconButton from '@smui/icon-button';
    import Tooltip, { Wrapper, Content as TooltipContent } from '@smui/tooltip';
    import { toast } from '@zerodevx/svelte-toast';
    import Badge from '@smui-extra/badge';

    import SectionTitleUnderline from '../../../components/SectionTitleUnderline.svelte';
    import { supportedLanguages } from '../../../data/languages';
    import ConfirmHoi4Path from '../../dialogs/ConfirmHoi4PathDialog.svelte';
    import { loading } from '../../../stores/loading';
    import { hoi4Path } from '../../../stores/hoi4Path';

    let currentLocale = supportedLanguages.find((l) => l.key === $locale);

    $: if (currentLocale) {
        locale.set(currentLocale.key);
    }
    $: gamePath = $hoi4Path ?? '';
    $: isValidHoi4Path = api.isValidHoi4Folder($hoi4Path);

    async function handleFolderPathSelect(auto = false) {
        const path = auto ? api.findHoi4DirPath() : await api.folderPathInput();

        if (!path && !auto) {
            return;
        }

        if (api.isValidHoi4Folder(path)) {
            const confirm = await dialogs.modal(ConfirmHoi4Path, {
                path,
                auto,
            });

            if (confirm) {
                try {
                    $loading = true;

                    await api.setHoi4DirPath(path);
                    hoi4Path.refresh();

                    $loading = false;

                    api.logs().info(`HOI4 dir path changed to : ${path}`);

                    toast.push(
                        $_('notification.select_hoi4_folder_path.success'),
                        { classes: ['success'] }
                    );
                } catch (e) {
                    $loading = false;
                    api.logs().error('Error while changing HOI4 dir path.');

                    toast.push(
                        $_('notification.select_hoi4_folder_path.error'),
                        { classes: ['error'] }
                    );
                }
            }
        } else {
            toast.push(
                $_(
                    auto
                        ? 'notification.select_hoi4_folder_path.not_found'
                        : 'notification.select_hoi4_folder_path.invalid'
                ),
                { classes: ['warning'] }
            );
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
            {#if !isValidHoi4Path}
                <Badge align="top-start" aria-label={$_('badge.hoi4_path.invalid')}>!</Badge>
            {/if}
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
            <IconButton
                class="material-icons"
                on:click={() => handleFolderPathSelect(true)}
                touch
                size="normal"
            >
                auto_awesome
            </IconButton>
            <Tooltip showDelay={1000} hideDelay={100}>
                <TooltipContent>
                    {$_('settings.game_folder.auto_find')}
                </TooltipContent>
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
    @import "settings.css";
</style>
