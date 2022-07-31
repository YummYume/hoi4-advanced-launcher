<script lang="ts">
    import Button, { Label as ButtonLabel } from '@smui/button';
    import { DialogContent, getClose, getOptions } from 'svelte-dialogs';
    import { _ } from 'svelte-i18n';

    const close = getClose();
    const { titleId } = getOptions();

    export let path: string;
    export let auto: boolean;
</script>

<DialogContent>
    <h1 id={titleId} slot="header">{$_('dialog.confirm_hoi4_path.title')}</h1>
    <svelte:fragment slot="body">
        <p>{$_(auto ? 'dialog.confirm_hoi4_path.description_auto' : 'dialog.confirm_hoi4_path.description')}</p>
        <div class="path-content">
            <pre>{path}</pre>
        </div>
    </svelte:fragment>
    <svelte:fragment slot="footer">
        <Button on:click={() => close(false)}>
            <ButtonLabel>{$_('common.cancel')}</ButtonLabel>
        </Button>
        <Button defaultAction on:click={() => close(true)}>
            <ButtonLabel>{$_('common.confirm')}</ButtonLabel>
        </Button>
    </svelte:fragment>
</DialogContent>

<style>
    .path-content {
        overflow-x: auto;
    }

    .path-content::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px rgb(204 204 204 / 80%);
        border-radius: 10px;
    }

    .path-content::-webkit-scrollbar-thumb {
        box-shadow: inset 0 0 5px #cccccc;
        border-radius: 10px;
    }

    .path-content::-webkit-scrollbar {
        width: 5px;
    }
</style>
