<script lang="ts">
    import Button, { Label as ButtonLabel } from '@smui/button';
    import Textfield from '@smui/textfield';
    import List, { Item, Graphic, Text as ListText } from '@smui/list';
    import Radio from '@smui/radio';
    import HelperText from '@smui/textfield/helper-text';
    import { DialogContent, getClose, getOptions } from 'svelte-dialogs';

    import type { Parameter } from '../data/parameters';

    const close = getClose();
    const { titleId } = getOptions();

    export let strictMode: boolean;
    export let parameter: Parameter;

    let argument = '';

    $: isValid = parameter.argument.matches(argument);
</script>

<DialogContent>
    <h1 id={titleId} slot="header">This parameter requires an argument</h1>
    <svelte:fragment slot="body">
        {#if parameter.argument.description}
            <p>{parameter.argument.description}</p>
        {/if}
        {#if parameter.argument.allowAny}
            <Textfield
                style="width: 100%;"
                helperLine$style="width: 100%;"
                label="Argument"
                bind:value={argument}
                type="text"
                invalid={strictMode && !isValid}
            >
                <HelperText slot="helper" style="color: #b00020;">
                    {#if strictMode}
                        {!isValid ? `Invalid argument : ${argument}` : ''}
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
            <ButtonLabel>Cancel</ButtonLabel>
        </Button>
        <Button defaultAction disabled={strictMode && !isValid} on:click={() => close(argument)}>
            <ButtonLabel>Confirm</ButtonLabel>
        </Button>
    </svelte:fragment>
</DialogContent>
