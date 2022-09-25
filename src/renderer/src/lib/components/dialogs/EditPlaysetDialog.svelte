<script lang="ts">
    import Button, { Label as ButtonLabel } from '@smui/button';
    import Textfield from '@smui/textfield';
    import HelperText from '@smui/textfield/helper-text';
    import { DialogContent, getClose, getOptions } from 'svelte-dialogs';
    import { _ } from 'svelte-i18n';

    import type { Playset } from '../../stores/playsets';

    const close = getClose();
    const { titleId } = getOptions();

    export let playset: Playset;

    $: newPlayset = playset;
    $: canConfirm = newPlayset.name.trim() !== '';
</script>

<DialogContent>
    <h1 id={titleId} slot="header">
        {$_('dialog.playset.edit')}
    </h1>
    <svelte:fragment slot="body">
        <Textfield
            style="width: 100%;"
            helperLine$style="width: 100%;"
            label={$_('playset.title')}
            bind:value={newPlayset.name}
            invalid={newPlayset.name.trim() === ''}
            variant="outlined"
        >
            <HelperText slot="helper" style="color: #b00020;">
                {#if newPlayset.name.trim() === ''}
                    {$_('common.field_required')}
                {/if}
            </HelperText>
        </Textfield>
        <Textfield
            style="width: 100%;"
            helperLine$style="width: 100%;"
            label={$_('playset.description')}
            textarea
            bind:value={newPlayset.description}
            variant="outlined"
        />
    </svelte:fragment>
    <svelte:fragment slot="footer">
        <Button on:click={() => close(null)}>
            <ButtonLabel>{$_('common.cancel')}</ButtonLabel>
        </Button>
        <Button
            defaultAction
            disabled={!canConfirm}
            on:click={() => close(newPlayset)}
        >
            <ButtonLabel>{$_('common.update')}</ButtonLabel>
        </Button>
    </svelte:fragment>
</DialogContent>
