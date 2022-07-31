<script lang="ts">
    import { _ } from 'svelte-i18n';
    import Button, { Label } from '@smui/button';

    import SectionTitleUnderline from '../../SectionTitleUnderline.svelte';

    async function handleLogsFolderOpen() {
        await api.openLogsFolder();
    }
</script>

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

<style>
    @import 'settings.css';
</style>
