<script lang="ts">
    import Button, { Label as ButtonLabel } from '@smui/button';
    import Textfield from '@smui/textfield';
    import List, { Item, Graphic, Text as ListText } from '@smui/list';
    import Radio from '@smui/radio';
    import HelperText from '@smui/textfield/helper-text';
    import { DialogContent, getClose, getOptions } from 'svelte-dialogs';
    import { _ } from 'svelte-i18n';

    import type { Parameter } from '../data/parameters';

    const close = getClose();
    const { titleId } = getOptions();

    export let strictMode: boolean;
    export let parameter: Parameter;

    let argument = '';

    $: isValid = parameter.argument.matches(argument);
</script>

<DialogContent>
    <h1 id={titleId} slot="header">
        {$_('argument.parameter_requires.title', {
            values: { required: parameter.argument.optional ? 'false' : 'true' }
        })}
    </h1>
    <svelte:fragment slot="body">
        {#if parameter.argument.description}
            <p>{$_(`argument.description.${parameter.argument.description}`)}</p>
        {/if}
        {#if parameter.argument.allowAny}
            <Textfield
                style="width: 100%;"
                helperLine$style="width: 100%;"
                label={$_('argument')}
                bind:value={argument}
                type="text"
                invalid={strictMode && !isValid && Boolean(argument)}
            >
                <HelperText slot="helper" style="color: #b00020;">
                    {#if strictMode}
                        {!isValid && Boolean(argument)
                            ? $_('dialog.parameter_argument.invalid_argument', { values: { argument } })
                            : ''}
                    {/if}
                </HelperText>
            </Textfield>
        {:else if parameter.argument.choices}
            <List radioList>
                {#each parameter.argument.choices as choice}
                    <Item>
                        <Graphic>
                            <Radio bind:group={argument} value={choice} />
                        </Graphic>
                        <ListText>{choice}</ListText>
                    </Item>
                {/each}
            </List>
        {/if}
    </svelte:fragment>
    <svelte:fragment slot="footer">
        <Button on:click={() => close(null)}>
            <ButtonLabel>{$_('common.cancel')}</ButtonLabel>
        </Button>
        {#if parameter.argument.optional}
            <Button on:click={() => close('')}>
                <ButtonLabel>{$_('common.skip')}</ButtonLabel>
            </Button>
        {/if}
        <Button
            defaultAction
            disabled={strictMode && (!isValid || !Boolean(argument))}
            on:click={() => close(argument)}
        >
            <ButtonLabel>{$_('common.confirm')}</ButtonLabel>
        </Button>
    </svelte:fragment>
</DialogContent>
