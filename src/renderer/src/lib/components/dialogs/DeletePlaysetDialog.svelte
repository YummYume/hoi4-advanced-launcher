<script lang="ts">
    import Button, { Label as ButtonLabel } from '@smui/button';
    import { DialogContent, getClose, getOptions } from 'svelte-dialogs';
    import { _ } from 'svelte-i18n';

    import type { Playset } from '../../stores/playsets';

    const close = getClose();
    const { titleId } = getOptions();

    export let playset: Playset;
</script>

<DialogContent>
    <h1 id={titleId} slot="header">
        {$_('dialog.playset.delete')}
    </h1>
    <svelte:fragment slot="body">
        {$_('dialog.playset.delete.confim', { values: { name: playset.name } })}
    </svelte:fragment>
    <svelte:fragment slot="footer">
        <Button defaultAction on:click={() => close(false)}>
            <ButtonLabel>{$_('common.cancel')}</ButtonLabel>
        </Button>
        <Button on:click={() => close(true)}>
            <ButtonLabel>{$_('common.confirm')}</ButtonLabel>
        </Button>
    </svelte:fragment>
</DialogContent>
